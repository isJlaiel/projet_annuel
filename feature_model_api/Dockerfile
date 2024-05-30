# Base Image
FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive


# Install Node.js and Java
RUN apt-get update && \
    apt-get install -y curl openjdk-17-jre-headless && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set Working Directory
WORKDIR /app

# Install NPM Packages
COPY package*.json ./
RUN npm install

# Copy Source Code
COPY . .

# Expose Backend Port
EXPOSE 3000

# Start Command
CMD ["npm", "run", "dev"]
