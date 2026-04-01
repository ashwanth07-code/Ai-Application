import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / 'models'
SCRIPTS_DIR = BASE_DIR / 'scripts'
UTILS_DIR = BASE_DIR / 'utils'

# Create directories if they don't exist
MODELS_DIR.mkdir(exist_ok=True)
SCRIPTS_DIR.mkdir(exist_ok=True)
UTILS_DIR.mkdir(exist_ok=True)

# Model paths
CHATBOT_MODEL_PATH = MODELS_DIR / 'chatbot_model.pkl'
SPAM_MODEL_PATH = MODELS_DIR / 'spam_model.pkl'
VECTORIZER_PATH = MODELS_DIR / 'vectorizer.pkl'

# Model configurations
CHATBOT_CONFIG = {
    'model_name': 'microsoft/DialoGPT-medium',
    'max_length': 1000,
    'temperature': 0.7,
    'top_k': 50,
    'top_p': 0.95
}

SPAM_CONFIG = {
    'max_features': 5000,
    'test_size': 0.2,
    'random_state': 42
}

SPEECH_CONFIG = {
    'language': 'en-US',
    'timeout': 5,
    'phrase_time_limit': 10
}

QA_CONFIG = {
    'model_name': 'distilbert-base-cased-distilled-squad',
    'max_answer_length': 100,
    'handle_impossible_answer': True
}

# Environment variables
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')