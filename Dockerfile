FROM daocloud.io/library/nginx:1.18.0-alpine
MAINTAINER roncoo
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
