#!/usr/bin/env python

from livereload.task import Task


def build(name):
    from araledoc.cli import load_settings, build_one
    from araledoc.options import g

    def func():
        g.debug = True
        load_settings()
        return build_one(name)
    return func


for name in ['calendar', 'validator', 'iframe-shim']:
    Task.add('lib/%s' % name, build(name))
