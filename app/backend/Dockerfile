FROM node:22-alpine AS runtime
RUN apk update && apk upgrade --no-cache
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY package*.json ./
RUN npm ci --omit=dev \
  && npm cache clean --force \
  && rm -rf /usr/local/lib/node_modules/npm \
            /usr/local/bin/npm \
            /usr/local/bin/npx
COPY src ./src
USER appuser
EXPOSE 8080
CMD ["node", "src/server.js"]