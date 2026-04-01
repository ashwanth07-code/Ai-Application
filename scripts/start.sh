#!/bin/bash

# AI Applications Platform Start Script
echo "🚀 Starting AI Applications Platform..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if required commands exist
if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

if ! command_exists python3; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Warning: Frontend dependencies not found. Running setup...${NC}"
    ./scripts/setup.sh
fi

if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Warning: Backend dependencies not found. Running setup...${NC}"
    ./scripts/setup.sh
fi

# Function to kill processes on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${GREEN}Starting backend server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to initialize
sleep 2

# Start frontend
echo -e "${GREEN}Starting frontend server...${NC}"
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo -e "${GREEN}📱 Frontend: ${NC}http://localhost:3000"
echo -e "${GREEN}🔧 Backend:  ${NC}http://localhost:5000"
echo -e "${GREEN}📊 Health:   ${NC}http://localhost:5000/health"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID