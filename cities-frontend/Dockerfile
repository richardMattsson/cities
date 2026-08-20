FROM node:alpine AS build
WORKDIR /app/cities-frontend
COPY cities-frontend/package*.json ./
RUN npm install
COPY cities-frontend/ ./
COPY shared/ /app/shared/
RUN npm run build

FROM nginx:stable
COPY --from=build /app/cities-frontend/dist /var/www/html
COPY cities-frontend/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]