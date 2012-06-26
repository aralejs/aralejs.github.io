#!/usr/bin/env python

import os
import re
import logging
import misaka as m
try:
    import json
    _json_decode = json.loads
except ImportError:
    import simplejson
    _json_decode = simplejson.loads
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter
from .utils import cjk_nowrap


class Package(object):
    def __init__(self, path):
        self.path = path
        logging.info('Loading %s' % path)

        f = open(os.path.join(path, 'package.json'))
        self._package = _json_decode(f.read())
        f.close()

    @property
    def name(self):
        return self._package['name']

    @property
    def version(self):
        return self._package['version']

    @property
    def description(self):
        return self._package.get('description', '')

    @property
    def homepage(self):
        return '/docs/%s/' % self.name

    @property
    def examples(self):
        path = os.path.join(self.path, 'examples')
        if not os.path.exists(path):
            return None
        files = os.listdir(path)
        files = filter(lambda p: p.endswith('.md'), files)
        return map(lambda p: p[:-3], files)

    @property
    def has_test(self):
        path = os.path.join(self.path, 'tests/runner.html')
        return os.path.exists(path)

    def render_homepage(self):
        f = open(os.path.join(self.path, 'README.md'))
        content = markdown(f.read())
        f.close()
        return content

    def render_example(self, name):
        f = open('%s.md' % os.path.join(self.path, 'examples', name))
        content = markdown(f.read(), inject=True)
        f.close()
        return content


class JuneRender(m.HtmlRenderer, m.SmartyPants):
    def set_options(self, options):
        self._options = options

    def paragraph(self, text):
        text = cjk_nowrap(text)
        return '<p>%s</p>\n' % text

    def block_code(self, text, lang):
        default_lang = self._options.get('lang', None)
        inject = self._options.get('inject', False)

        if lang:
            lexer = get_lexer_by_name(lang, stripall=True)
        elif default_lang:
            lexer = get_lexer_by_name(default_lang, stripall=True)
        else:
            return '\n<pre><code>%s</code></pre>\n' %\
                    escape(text.strip())
        formatter = HtmlFormatter()
        html = highlight(text, lexer, formatter)
        if lang == 'javascript' and inject:
            html += '\n<script type="text/javascript">\n%s</script>\n' % text

        return html

    def autolink(self, link, is_email):
        title = link

        if is_email:
            return '<a href="mailto:%(link)s">%(link)s</a>' % {'link': link}

        #: gist support
        pattern = r'(https?://gist.github.com/[\d]+)'
        match = re.match(pattern, link)
        if match:
            value = ('<script src="%(link)s.js"></script>'
                     '<div><a rel="nofollow" href="%(link)s">'
                     '%(title)s</a></div>'
                    ) % {'link': match.group(1), 'title': title}
            return value

        return '<a href="%s">%s</a>' % (link, title)

    def link(self, link, title, content):
        if link.isalpha():
            link = '../%s/' % link

        if not title:
            return '<a href="%s">%s</a>' % (link, content)
        return '<a href="%s" title="%s">%s</a>' % (link, title, content)


def markdown(text, lang=None, inject=False):
    if not isinstance(text, (unicode, type(None))):
        text = text.decode('utf-8')

    render = JuneRender(flags=m.HTML_USE_XHTML)
    render.set_options({'lang': lang, 'inject': inject})

    md = m.Markdown(
        render,
        extensions=m.EXT_FENCED_CODE | m.EXT_AUTOLINK,
    )
    return md.render(text)

_XHTML_ESCAPE_RE = re.compile('[&<>"]')
_XHTML_ESCAPE_DICT = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}


def escape(value):
    """Escapes a string so it is valid within XML or XHTML."""
    if not isinstance(value, (basestring, type(None))):
        value = value.decode('utf-8')
    return _XHTML_ESCAPE_RE.sub(
        lambda match: _XHTML_ESCAPE_DICT[match.group(0)], value)
