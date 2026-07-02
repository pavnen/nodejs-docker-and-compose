FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json  ./
RUN npm i
COPY . ./
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm i --prod
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js ./
EXPOSE 4000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]