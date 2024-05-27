# Base Image
FROM ubuntu:20.04

# Avoid user interaction with tzdata
ARG DEBIAN_FRONTEND=noninteractive

# User Setup
ARG USERNAME=user
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN echo "USER_UID : "${USER_UID}" \nUSER_GID : "${USER_GID} && \
    groupadd --gid $USER_GID $USERNAME && \
    useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME && \
    apt-get update && \
    apt-get install -y sudo wget && \
    echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME && \
    chmod 0440 /etc/sudoers.d/$USERNAME

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
