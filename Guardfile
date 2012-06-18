#!/usr/bin/env python

from livereload.task import Task


def build(name):
    from araledoc.cli import load_settings, build_one

    def func():
        load_settings()
        return build_one(name)
    return func


for name in ['calendar', 'validator']:
    Task.add('lib/%s' % name, build(name))
