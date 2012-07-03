# Makefile for arale project

server:
	livereload

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
	mkdir -p build
	cd dist && zip -r dist $(W)/$(V) && mv dist.zip ../build/
