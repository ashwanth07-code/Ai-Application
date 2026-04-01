# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install Python and build dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    build-base \
    && ln -sf python3 /usr/bin/python

# Copy package files
COPY backend/package*.json ./

# Install Node dependencies
RUN npm ci --only=production

# Copy Python requirements
COPY ai-models/requirements.txt ./ai-models/

# Install Python dependencies
RUN pip3 install --no-cache-dir -r ai-models/requirements.txt

# Copy source code
COPY backend/ ./
COPY ai-models/ ./ai-models/

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

CMD ["npm", "start"]