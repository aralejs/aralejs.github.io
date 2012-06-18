#!/usr/bin/env python

import os
import argparse
from reader import markdown


def main():
    parser = argparse.ArgumentParser(prog='araledoc')
    parser.add_argument('file', nargs='*', type=str)
    parser.add_argument('-i', '--inject', dest='inject', action='store_true')
    parser.add_argument('-t', '--template', dest='template')
    parser.add_argument('-l', '--language', dest='language')

    args = parser.parse_args()
    if args.template and args.template == 'default':
        path = os.path.join(os.path.dirname(__file__), 'template.html')
        template = open(os.path.abspath(path)).read()
    elif args.template:
        template = open(args.template).read()
    else:
        template = "{{text}}"

    text = ''
    for f in args.file:
        text += markdown(open(f).read(), args.language, args.inject)

    text = template.replace('{{text}}', text)
    print(text.encode('utf-8'))
