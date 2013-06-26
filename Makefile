THEME = $(HOME)/.spm/themes/arale

build-doc:
	@nico build -C $(THEME)/nico.js

debug:
	@nico server -C $(THEME)/nico.js --watch debug

server:
	@nico server -C $(THEME)/nico.js

watch:
	@nico server -C $(THEME)/nico.js --watch

status:
	@spm config online-status.online https://a.alipayobjects.com
	@spm status arale -O _site/status-arale.js
	@spm status gallery -O _site/status-gallery.js
	@spm status jquery -O _site/status-jquery.js

publish-doc: clean build-doc status
	@rm -fr _site/sea-modules
	@spm publish --doc _site -s spmjs

clean:
	@rm -fr _site



.PHONY: build-doc debug server publish clean test coverage
