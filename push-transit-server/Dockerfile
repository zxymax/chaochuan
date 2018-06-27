FROM node:8.9.1-alpine

MAINTAINER shanjunfeng <shanjf@i-counting.cn>

WORKDIR /home/message

ADD ./ /home/message

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
RUN apk add --no-cache curl

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --retries=2 --start-period=10s \
                CMD curl --fail http://localhost:3000/health/check || exit 1

CMD ["yarn", "start"]