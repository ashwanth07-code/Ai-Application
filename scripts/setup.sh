#!/bin/bash

# AI Applications Platform Setup Script
echo "🚀 Setting up AI Applications Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[i]${NC} $1"
}

# Check requirements
check_requirements() {
    print_info "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v18 or higher."
        exit 1
    else
        node_version=$(node -v)
        print_status "Node.js ${node_version} is installed"
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    else
        npm_version=$(npm -v)
        print_status "npm ${npm_version} is installed"
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.8 or higher."
        exit 1
    else
        python_version=$(python3 -V)
        print_status "${python_version} is installed"
    fi
    
    # Check pip
    if ! command -v pip3 &> /dev/null; then
        print_error "pip3 is not installed"
        exit 1
    else
        pip_version=$(pip3 -V | awk '{print $2}')
        print_status "pip ${pip_version} is installed"
    fi
}

# Create necessary directories
create_directories() {
    print_info "Creating directories..."
    
    mkdir -p backend/uploads
    mkdir -p ai-models/models
    mkdir -p logs
    mkdir -p frontend/node_modules
    mkdir -p backend/node_modules
    
    print_status "Directories created successfully"
}

# Install frontend dependencies
install_frontend() {
    print_info "Installing frontend dependencies..."
    cd frontend
    
    if npm install; then
        print_status "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    cd ..
}

# Install backend dependencies
install_backend() {
    print_info "Installing backend dependencies..."
    cd backend
    
    if npm install; then
        print_status "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    cd ..
}

# Install Python dependencies
install_python() {
    print_info "Installing Python AI model dependencies..."
    cd ai-models
    
    if pip3 install -r requirements.txt; then
        print_status "Python dependencies installed successfully"
    else
        print_error "Failed to install Python dependencies"
        exit 1
    fi
    
    # Download NLTK data
    print_info "Downloading NLTK data..."
    python3 -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')" 2>/dev/null
    
    cd ..
}

# Create environment file
create_env() {
    if [ ! -f .env ]; then
        print_info "Creating .env file..."
        cat > .env << EOF
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# API Keys (if needed)
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_CLOUD_API_KEY=your_google_api_key_here

# Database (if using)
DATABASE_URL=mongodb://localhost:27017/ai-platform
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your_jwt_secret_key_change_this_in_production
SESSION_SECRET=your_session_secret_change_this_in_production
EOF
        print_status ".env file created successfully"
    else
        print_info ".env file already exists"
    fi
}

# Main setup function
main() {
    echo "========================================"
    echo "   AI Applications Platform Setup"
    echo "========================================"
    echo ""
    
    check_requirements
    echo ""
    
    create_directories
    echo ""
    
    install_frontend
    echo ""
    
    install_backend
    echo ""
    
    install_python
    echo ""
    
    create_env
    echo ""
    
    echo "========================================"
    echo -e "${GREEN}✅ Setup Complete!${NC}"
    echo "========================================"
    echo ""
    echo "To start the application:"
    echo "  1. Start backend:  cd backend && npm run dev"
    echo "  2. Start frontend: cd frontend && npm start"
    echo "  3. Open browser:   http://localhost:3000"
    echo ""
    echo "Or use Docker:"
    echo "  docker-compose up --build"
    echo ""
}

# Run main function
main