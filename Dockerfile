# Set the base image to ericenns/hivtrace
FROM ericenns/hivtrace

# Install hivtrace-web
RUN /home/bio/env/bin/pip3 install flask
COPY . /home/bio/hivtrace-web

USER root

RUN chown -R bio /home/bio/hivtrace-web

USER bio
# Set the entry point for hivtrace-web
EXPOSE 5000
ENTRYPOINT []
CMD ["python3", "/home/bio/hivtrace-web/app.py"]
