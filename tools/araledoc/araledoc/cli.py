#!/usr/bin/env python

import argparse
from reader import Package
from writer import AraleWriter


def build_one(name):
    path = 'lib/%s' % name
    package = Package(path)
    writer = AraleWriter(package)
    writer.run()


def main():
    parser = argparse.ArgumentParser(prog='araledoc')
    parser.add_argument('name', nargs='*', type=str)

    args = parser.parse_args()
    for name in args.name:
        build_one(name)


if __name__ == '__main__':
    main()
