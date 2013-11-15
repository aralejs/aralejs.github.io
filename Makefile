THEME = $(HOME)/.spm/themes/cmd

build-doc:
	@nico build -C $(THEME)/nico.js

debug:
	@nico server -C $(THEME)/nico.js --watch debug

server:
	@nico server -C $(THEME)/nico.js

watch:
	@nico server -C $(THEME)/nico.js --watch

status:
	@spm status seajs -O _site/status-seajs.js
	@spm status arale -O _site/status-arale.js
	@spm status gallery -O _site/status-gallery.js
	@spm status jquery -O _site/status-jquery.js

publish: clean build-doc status
	@rm -fr _site/sea-modules
	@spm publish --doc _site -s spmjs

clean:
	@rm -fr _site


.PHONY: build-doc debug server publish clean test coverage
