FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG LANDING_URL=http://localhost:4001
ARG DASHBOARD_URL=http://localhost:4002
ARG API_REF_URL=http://localhost:4000/api/reference
ENV LANDING_URL=$LANDING_URL
ENV DASHBOARD_URL=$DASHBOARD_URL
ENV API_REF_URL=$API_REF_URL
RUN npm run generate

FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/.output/public /usr/share/nginx/html
EXPOSE 4003
CMD ["nginx", "-g", "daemon off;"]
