# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package management files
COPY package*.json ./

# Force npm to install ALL dependencies, including devDependencies like @vue/cli-service
RUN npm install --include=dev

# Copy the rest of your application code
COPY . .

# Run the Vue build
RUN npm run build

# Stage 2: Production web server stage
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration if you have one
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]