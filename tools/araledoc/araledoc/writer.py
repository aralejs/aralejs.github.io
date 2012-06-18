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
import liquidluck
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
            'name': 'Felix Felicis',
            'version': liquidluck.__version__,
            'homepage': liquidluck.__homepage__,
            'time': datetime.datetime.utcnow(),
        }
    })

    #: default filters
    jinja.filters.update({
        'xmldatetime': lambda o: o.strftime('%Y-%m-%dT%H:%M:%SZ'),
    })

    g.jinja = jinja
    return jinja
