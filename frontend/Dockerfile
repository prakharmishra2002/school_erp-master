FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies (only copy package.json first to leverage cache)
COPY package.json package-lock.json* ./
RUN npm install

# Copy application files
COPY . .

# Expose port (Next.js dev server default is 3000)
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
