FROM node:alpine
WORKDIR /app/cities-backend
COPY cities-backend/package*.json ./
RUN npm install --include=dev
COPY cities-backend/ ./
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]