# Makefile for arale project

server:
	livereload

# dist

dist: events class base widget cookie iframe-shim position easing validator querystring overlay dropdown dialog switchable calendar

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

triggerable:
	node tools/dist.js triggerable

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

#zip
#example: make zip W=validator V=0.8.1
#生成dist.zip在arale/build/dist.zip ，这个文件满足格式需求，可以直接上传到ecmng
W = *
V = *
zip: $(WIDGET)
	rm -rf build/dist.zip
	cd dist && zip -r dist $(W)/$(V) && mv dist.zip ../build/
