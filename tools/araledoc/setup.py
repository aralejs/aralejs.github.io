#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

use_2to3 = False
major, minor = sys.version_info[:2]
if major >= 3:
    use_2to3 = True

from setuptools import setup
install_requires = ['Jinja2', 'Pygments', 'misaka']
try:
    import argparse  # python 2.7+ support argparse
except ImportError:
    install_requires.append('argparse')


setup(
    name='araledoc',
    version='0.1',
    author='Hsiaoming Yang',
    author_email='lepture@me.com',
    packages=['araledoc'],
    description='arale documentation generator',
    license='BSD License',
    entry_points={
        'console_scripts': ['araledoc= araledoc.cli:main'],
    },
    install_requires=install_requires,
    include_package_data=True,
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'License :: OSI Approved :: BSD License',
        'Operating System :: MacOS',
        'Operating System :: POSIX',
        'Operating System :: POSIX :: Linux',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.6',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.1',
        'Programming Language :: Python :: 3.2',
        'Programming Language :: Python :: Implementation :: CPython',
        'Topic :: Text Processing :: Markup',
    ],
    use_2to3=use_2to3,
)
