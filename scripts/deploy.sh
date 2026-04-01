#!/bin/bash

# AI Applications Platform Deployment Script
echo "🚀 Deploying AI Applications Platform..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"localhost"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}
DEPLOY_ENV=${DEPLOY_ENV:-"production"}

# Function to print status
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[i]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check Docker
check_docker() {
    print_info "Checking Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    print_status "Docker is installed"
}

# Build Docker images
build_images() {
    print_info "Building Docker images..."
    
    # Build frontend
    docker build -f docker/frontend.Dockerfile \
        -t ${DOCKER_REGISTRY}/ai-frontend:${IMAGE_TAG} \
        -t ${DOCKER_REGISTRY}/ai-frontend:latest .
    
    # Build backend
    docker build -f docker/backend.Dockerfile \
        -t ${DOCKER_REGISTRY}/ai-backend:${IMAGE_TAG} \
        -t ${DOCKER_REGISTRY}/ai-backend:latest .
    
    print_status "Docker images built successfully"
}

# Push images to registry
push_images() {
    if [ -n "$DOCKER_REGISTRY" ] && [ "$DOCKER_REGISTRY" != "localhost" ]; then
        print_info "Pushing images to registry..."
        
        docker push ${DOCKER_REGISTRY}/ai-frontend:${IMAGE_TAG}
        docker push ${DOCKER_REGISTRY}/ai-frontend:latest
        docker push ${DOCKER_REGISTRY}/ai-backend:${IMAGE_TAG}
        docker push ${DOCKER_REGISTRY}/ai-backend:latest
        
        print_status "Images pushed successfully"
    fi
}

# Deploy with Docker Compose
deploy_compose() {
    print_info "Deploying with Docker Compose..."
    
    # Set environment variables
    export NODE_ENV=${DEPLOY_ENV}
    export IMAGE_TAG=${IMAGE_TAG}
    
    # Pull latest images if registry is configured
    if [ -n "$DOCKER_REGISTRY" ] && [ "$DOCKER_REGISTRY" != "localhost" ]; then
        docker-compose pull
    fi
    
    # Start services
    docker-compose up -d --remove-orphans
    
    print_status "Services deployed successfully"
}

# Check deployment status
check_deployment() {
    print_info "Checking deployment status..."
    
    # Wait for services to be healthy
    sleep 10
    
    # Check backend health
    if curl -s http://localhost:5000/health | grep -q "OK"; then
        print_status "Backend is healthy"
    else
        print_error "Backend health check failed"
    fi
    
    # Check frontend
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        print_status "Frontend is responding"
    else
        print_error "Frontend health check failed"
    fi
}

# Backup data
backup_data() {
    print_info "Creating backup..."
    
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p $BACKUP_DIR
    
    # Backup database if exists
    if [ -f "backend/data" ]; then
        cp -r backend/data $BACKUP_DIR/
    fi
    
    # Backup models
    if [ -f "ai-models/models" ]; then
        cp -r ai-models/models $BACKUP_DIR/
    fi
    
    print_status "Backup created at $BACKUP_DIR"
}

# Main deployment function
main() {
    echo "========================================"
    echo "   AI Applications Platform Deployment"
    echo "========================================"
    echo ""
    
    # Create backup before deployment
    backup_data
    echo ""
    
    # Check Docker
    check_docker
    echo ""
    
    # Build images
    build_images
    echo ""
    
    # Push images (if registry configured)
    push_images
    echo ""
    
    # Deploy
    deploy_compose
    echo ""
    
    # Check deployment
    check_deployment
    echo ""
    
    echo "========================================"
    echo -e "${GREEN}✅ Deployment Complete!${NC}"
    echo "========================================"
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend:  http://localhost:5000"
    echo "Health:   http://localhost:5000/health"
    echo ""
}

# Run main function
main