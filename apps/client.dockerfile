FROM node:20-alpine AS builder
WORKDIR /apps
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
COPY ./packages /apps/packages
COPY ./client /apps/client
WORKDIR /apps/client
RUN npm install
RUN npm run build
FROM node:20-alpine AS runner
WORKDIR /client
COPY --from=builder /apps/client/.next ./.next
COPY --from=builder /apps/client/public ./public
COPY --from=builder /apps/client/package.json ./
COPY --from=builder /apps/client/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run","start"]