# Install latest node
FROM node:latest

# Set the workdir /var/www/septiyanapp
WORKDIR /var/www/septiyanapp

COPY package*.json ./

# seed data admin
RUN npm install

RUN npm install -g nodemon babel-cli

# Copy application source
COPY . .

# Expose application ports - (4300 - for API)
EXPOSE 3000

EXPOSE 6379

# Start the application
CMD ["npm", "run", "start"]