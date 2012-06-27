#!/usr/bin/env python

from livereload.task import Task


def build(name):
    from nico.cli import debug

    def func():
        return debug(name)

    return func


for name in ['calendar', 'validator', 'iframe-shim']:
    Task.add('lib/%s' % name, build(name))
