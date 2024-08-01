# Use a specific Node.js version image
FROM node:20.15.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port that your application runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
