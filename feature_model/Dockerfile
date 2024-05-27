# Base Image
FROM node:18

# Set Working Directory
WORKDIR /app

# Install NPM Packages
COPY package*.json ./
RUN npm install

# Copy Source Code
COPY . .

# Expose Frontend Port
EXPOSE 5173 

# Start Command
CMD ["npm", "run", "dev"]
