# Frontend — Vite + React, built then served as static files via Nginx.
#
# NOTE: VITE_API_URL gets baked into the JS bundle at BUILD time (same as
# the GitHub Pages workflow) — there's no server here to inject it at
# runtime. Pass it with --build-arg when building this image, e.g.:
#   docker build --build-arg VITE_API_URL=http://localhost:5000/api -t frontend .

# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine

# Overwrite Nginx's own default.conf: without this, refreshing on a
# client-side route (e.g. /login) or hitting it directly would 404, since
# Nginx would look for a literal /login file that doesn't exist. This
# rewrites any unmatched path back to index.html so React Router can
# handle it — same problem GitHub Pages has, solved differently here
# since Nginx CAN do server-side rewrites (unlike GH Pages' static hosting).
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
