FROM node:20-alpine AS runner
WORKDIR /apps
COPY ./packages /apps/packages
COPY ./client /apps/client
WORKDIR /apps/client
EXPOSE 3000
CMD ["npm", "run","dev"]