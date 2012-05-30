# Makefile for arale modules

.PHONY: widget overlay


all: widget overlay

widget:
	node tools/dist.js widget

overlay:
	node tools/dist.js overlay
