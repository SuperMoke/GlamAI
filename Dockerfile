FROM alpine:latest

ARG PB_VERSION=0.27.0

RUN apk add --no-cache \
    unzip \
    openssh

# Download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb && \
    rm /tmp/pb.zip

EXPOSE 8080


# Start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]