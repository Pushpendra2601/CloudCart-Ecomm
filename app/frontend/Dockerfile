FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
COPY index.html ./
COPY tsconfig.json vite.config.ts tailwind.config.ts postcss.config.js ./
COPY src ./src
RUN npm run build

FROM nginx:1.27-alpine
RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html/
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
EXPOSE 80
