clean:
	rm -f web/widget.js

build: clean
	docker build . -t  widget-lba
	docker run widget-lba cat /code/build/bundle.js > web/widget.js

start-widget-no-esd: build
	echo Please load the following URL in your browser: http://127.0.0.1:8093/widget-no-esd.html
	cd web && python -m http.server 8093