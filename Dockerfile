# ============================================
# SwissKnife — Dockerfile (multi-stage)
# Stage 1: Node 20 build
# Stage 2: nginx unprivileged on 8080
# ============================================

FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_APP_TITLE=SwissKnife
ENV VITE_APP_TITLE=$VITE_APP_TITLE

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine

USER root
RUN apk add --no-cache wget \
    && rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
