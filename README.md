HIV-Trace Web
=============
HIV-Trace Web is a simple web interface to HIV-Trace, with interface borrowed from [datamonkey](http://test.datamonkey.org/hivtrace) and [hyphy-vision](https://github.com/veg/hyphy-vision), and a custom flask backend.

docker instructions
-------------------

### how to build
`docker build -t ericenns/hivtrace-web .`

### how to download and install
`docker pull ericenns/hivtrace-web`

### how to use 
`docker run -it -p 5000:5000 ericenns/hivtrace-web`

non-docker instructions
-----------------------

### System Dependencies
HIV-Trace Web requires that (HIV-Trace) be installed.

### Install using pip
`pip install flask`

### Example Usage
`python app.py`

software website
----------------
visit [HIV-Trace](https://github.com/veg/hivtrace) website for more information about usage and licensing.

support
-------
we do not provide support for the containerized software, only to aspects regarding the container itself
and its usage. For more information about the software usage, please refer to the publication.

license
-------
the license present in this repository refers to the flask backend and the instructions necessary to create the containers. The web interface is governed by the [datamonkey license](http://test.datamonkey.org/copyright_notice), which is included in the web interface with a link in the footer.

maintainers
-----------
* Eric Enns <eric.enns@gmail.com>
