#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
Writer, write your content to html.

:copyright: (c) 2012 by Hsiaoming Yang (aka lepture)
:license: BSD
'''


import os
import datetime
import logging
from jinja2 import Environment, FileSystemLoader
from .utils import utf8

from .options import g


class BaseWriter(object):
    """BaseWriter
    """
    def start(self):
        raise NotImplementedError

    def run(self):
        try:
            self.start()
        except Exception as e:
            logging.error(e)

        name = self.__class__.__name__
        logging.info('%s Finished' % name)

    def write(self, content, destination):
        destination = destination.lower()
        destination = destination.replace(' ', '-')
        folder = os.path.split(destination)[0]
        # on Mac OSX, `folder` == `FOLDER`
        # then make sure destination is lowercase
        if not os.path.isdir(folder):
            os.makedirs(folder)

        f = open(destination, 'w')
        f.write(utf8(content))
        f.close()
        return

    def render(self, params, template, destination):
        if g.detail_logging:
            logging.info('write %s' % destination)
        tpl = g.jinja.get_template(template)
        html = tpl.render(params)
        self.write(html, destination)
        #: logging
        return


class AraleWriter(BaseWriter):
    def __init__(self, package):
        self.package = package

    def write_homepage(self):
        content = self.package.render_homepage()
        params = {'content': content, 'package': self.package}
        dest = os.path.join('docs', self.package.name, 'index.html')
        self.render(params, 'homepage.html', dest)

    def write_examples(self):
        for name in self.package.examples:
            content = self.package.render_example(name)
            params = {'content': content, 'package': self.package}
            dest = os.path.join('docs', self.package.name, 'examples', name)
            dest = '%s.html'
            self.render(params, 'example.html', dest)

    def start(self):
        self.write_homepage()
        self.write_examples()


def load_jinja():
    #: prepare loaders
    #: loaders = ['_templates', theme]
    loaders = []
    tpl = os.path.abspath('_templates')
    if os.path.exists(tpl):
        loaders.append(tpl)

    #: init jinja
    jinja = Environment(
        loader=FileSystemLoader(loaders),
        autoescape=False,  # blog don't need autoescape
    )
    #: initialize globals
    jinja.globals = {}

    #: default variables
    jinja.globals.update({
        'system': {
            'name': 'Araledoc',
            'time': datetime.datetime.utcnow(),
        }
    })

    #: default filters
    jinja.filters.update({
        'xmldatetime': lambda o: o.strftime('%Y-%m-%dT%H:%M:%SZ'),
    })

    g.jinja = jinja
    return jinja
