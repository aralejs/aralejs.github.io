# Makefile for arale modules

.PHONY: widget overlay


all: widget overlay

base:
	node tools/dist.js base

widget:
	node tools/dist.js widget

overlay:
	node tools/dist.js overlay
