.PHONY: help setup install-frontend install-backend install-ai-models run-frontend run-backend run-all clean test

help:
	@echo "Available commands:"
	@echo "  make setup          - Complete setup of all components"
	@echo "  make install-all    - Install all dependencies"
	@echo "  make run-all        - Run both frontend and backend"
	@echo "  make run-frontend   - Run only frontend"
	@echo "  make run-backend    - Run only backend"
	@echo "  make test           - Run tests"
	@echo "  make clean          - Clean temporary files"

setup: install-all

install-all: install-frontend install-backend install-ai-models

install-frontend:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install

install-backend:
	@echo "📦 Installing backend dependencies..."
	cd backend && npm install

install-ai-models:
	@echo "📦 Installing Python AI model dependencies..."
	cd ai-models && pip install -r requirements.txt
	cd ai-models && python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

run-frontend:
	@echo "🚀 Starting frontend server..."
	cd frontend && npm start

run-backend:
	@echo "🚀 Starting backend server..."
	cd backend && npm run dev

run-all:
	@echo "🚀 Starting all services..."
	@make -j2 run-backend run-frontend

test:
	@echo "🧪 Running tests..."
	cd frontend && npm test
	cd backend && npm test

clean:
	@echo "🧹 Cleaning temporary files..."
	rm -rf frontend/node_modules
	rm -rf backend/node_modules
	rm -rf backend/uploads/*
	rm -rf ai-models/__pycache__
	rm -rf ai-models/models/*.pkl
	rm -rf logs/*
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.log" -delete
	@echo "✅ Clean complete!"