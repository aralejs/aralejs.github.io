# Makefile for arale project


# dist

all: events class base widget cookie iframe-shim position easing validator querystring overlay dropdown dialog switchable calendar

events:
	node tools/dist.js events

class:
	node tools/dist.js class

base:
	node tools/dist.js base

widget:
	node tools/dist.js widget

cookie:
	node tools/dist.js cookie

iframe-shim:
	node tools/dist.js iframe-shim

position:
	node tools/dist.js position

easing:
	node tools/dist.js easing

validator:
	node tools/dist.js validator

querystring:
	node tools/dist.js querystring

overlay:
	node tools/dist.js overlay

dropdown:
	node tools/dist.js dropdown

dialog:
	node tools/dist.js dialog

switchable:
	node tools/dist.js switchable

calendar:
	node tools/dist.js calendar


# git

push:
	git push origin master

pull:
	git pull origin master
