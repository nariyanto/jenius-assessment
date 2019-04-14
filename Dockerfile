# Install latest node
FROM node:latest

# Set the workdir /var/www/septiyanapp
WORKDIR /var/www/septiyanapp

# Run npm install - install the npm dependencies
RUN npm install

# Copy application source
COPY . .

# Expose application ports - (4300 - for API)
EXPOSE 4300

# Generate build
RUN npm run build

# Start the application
CMD ["npm", "run", "start"]