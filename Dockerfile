FROM ubuntu:16.04

WORKDIR app

COPY ./client/dist /app/dist

ADD neural-style-data-server /app 

ENV PATH $PATH:/app

CMD ["neural-style-data-server"]

EXPOSE 8000