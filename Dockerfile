# Use official Node.js LTS lightweight image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port (default 3000)
EXPOSE 3000

# Set default environment variables
ENV NODE_ENV=production \
    PORT=3000

# Start the Node.js application
CMD ["npm", "start"]
