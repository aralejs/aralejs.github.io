.PHONY: clean-pyc clean-build install

clean: clean-build clean-pyc


clean-build:
	rm -fr deploy/
	rm -fr build/
	rm -fr dist/
	rm -fr test/build/
	rm -fr *.egg-info


clean-pyc:
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +
	find . -name '__pycache__' -exec rm -fr {} +


install: clean-build clean-pyc
	python setup.py install
