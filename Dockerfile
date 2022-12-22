# Builder image
FROM registry.access.redhat.com/ubi8/nodejs-18:latest AS builder
USER root
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm --version

COPY . /opt/app-root/src

RUN pnpm install
RUN pnpm test
RUN pnpm build

# Final image
FROM registry.access.redhat.com/ubi8/nginx-120:1-74
COPY --from=builder /opt/app-root/src/dist/ .
COPY --from=builder /opt/app-root/src/default.conf "${NGINX_CONFIGURATION_PATH}"
USER ${USER_UID}
EXPOSE 9443

CMD ["nginx", "-g", "daemon off;"]

