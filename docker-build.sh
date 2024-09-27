#!/usr/bin/sh
docker build -t cbstorm/wyrstream_app:latest .
docker push cbstorm/wyrstream_app:latest
