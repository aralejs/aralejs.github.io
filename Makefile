# Makefile for arale modules


all: base class widget position overlay dropdown switchable

base:
	node tools/dist.js base

class:
	node tools/dist.js class

widget:
	node tools/dist.js widget

position:
	node tools/dist.js position

overlay:
	node tools/dist.js overlay

dropdown:
	node tools/dist.js dropdown

switchable:
	node tools/dist.js switchable


# git

push:
	git push origin master

pull:
	git pull origin master
