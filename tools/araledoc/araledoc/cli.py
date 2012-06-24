#!/usr/bin/env python

import argparse
from .options import enable_pretty_logging, g
from .reader import Package
from .writer import AraleWriter, StaticWriter, load_jinja

def load_settings():
    load_jinja()


def build_one(name):
    path = 'lib/%s' % name
    package = Package(path)
    writer = AraleWriter(package)
    writer.run()
    StaticWriter().run()


def main():
    parser = argparse.ArgumentParser(prog='araledoc')
    parser.add_argument('name', nargs='*', type=str)
    parser.add_argument('-d', '--debug', action='store_true')

    args = parser.parse_args()
    enable_pretty_logging()

    g.debug = args.debug
    load_settings()
    for name in args.name:
        build_one(name)


if __name__ == '__main__':
    main()
