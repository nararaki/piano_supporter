FROM node:20-alpine AS builder
WORKDIR /apps
COPY ./packages /apps/packages
COPY ./server /apps/server 
WORKDIR /apps/server
RUN npm install
RUN npm run build
RUN npm install --production
FROM node:20-alpine AS runner
WORKDIR /server
USER node
COPY --from=builder /apps/server/dist ./
COPY --from=builder /apps/server/package.json ./
COPY --from=builder /apps/server/package-lock.json ./
COPY --from=builder /apps/server/drizzle.config.ts ./
COPY --from=builder /apps/server/node_modules ./node_modules
COPY --from=builder /apps/server/drizzle ./drizzle
EXPOSE 8000