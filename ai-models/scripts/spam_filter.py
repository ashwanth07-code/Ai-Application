#!/usr/bin/env python3
"""
Spam Detection using Machine Learning
"""
import sys
import json
import pickle
import re
import nltk
import os
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import warnings
warnings.filterwarnings('ignore')

# Download NLTK data if needed
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

class SpamDetector:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), '../models/spam_model.pkl')
        self.vectorizer_path = os.path.join(os.path.dirname(__file__), '../models/vectorizer.pkl')
        self.stop_words = set(stopwords.words('english'))
        self.stemmer = PorterStemmer()
        self.vectorizer = None
        self.classifier = None
        self._load_or_train_model()
    
    def preprocess_text(self, text):
        """Clean and preprocess text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Tokenize
        words = text.split()
        
        # Remove stopwords and stem
        words = [self.stemmer.stem(word) for word in words 
                if word not in self.stop_words and len(word) > 2]
        
        return ' '.join(words)
    
    def _load_or_train_model(self):
        """Load existing model or train a new one"""
        try:
            # Try to load existing models
            with open(self.model_path, 'rb') as f:
                self.classifier = pickle.load(f)
            with open(self.vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)
            print("Models loaded successfully!", file=sys.stderr)
        except:
            print("Training new model...", file=sys.stderr)
            # Sample training data
            spam_emails = [
                "WINNER!! You have won a FREE vacation! Click here to claim",
                "Congratulations! You've been selected for a cash prize",
                "URGENT: Your account needs verification",
                "Earn money fast! Work from home opportunity",
                "You have been selected for a free iPhone",
                "Claim your $1000 gift card now",
                "Increase your chances today!",
                "Special promotion just for you",
            ]
            
            ham_emails = [
                "Meeting scheduled for tomorrow at 10am",
                "Please find attached the quarterly report",
                "Can you review this document when you have time",
                "Thanks for your help with the project",
                "The team meeting has been rescheduled",
                "Please update the project status",
                "Let's discuss this in tomorrow's meeting",
                "I've attached the files you requested",
            ]
            
            # Combine and create labels
            emails = spam_emails + ham_emails
            labels = [1] * len(spam_emails) + [0] * len(ham_emails)
            
            # Preprocess emails
            print("Preprocessing emails...", file=sys.stderr)
            processed = [self.preprocess_text(email) for email in emails]
            
            # Vectorize
            print("Vectorizing text...", file=sys.stderr)
            self.vectorizer = TfidfVectorizer(max_features=5000)
            X = self.vectorizer.fit_transform(processed)
            
            # Train classifier
            print("Training classifier...", file=sys.stderr)
            self.classifier = MultinomialNB()
            self.classifier.fit(X, labels)
            
            # Save models
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            with open(self.model_path, 'wb') as f:
                pickle.dump(self.classifier, f)
            with open(self.vectorizer_path, 'wb') as f:
                pickle.dump(self.vectorizer, f)
            print("Models saved successfully!", file=sys.stderr)
    
    def predict(self, email):
        """Predict if email is spam"""
        try:
            # Preprocess the email
            processed = self.preprocess_text(email)
            
            # Vectorize
            X = self.vectorizer.transform([processed])
            
            # Predict
            prediction = self.classifier.predict(X)[0]
            probabilities = self.classifier.predict_proba(X)[0]
            
            # Calculate spam score (0-1)
            spam_score = float(probabilities[1])
            confidence = float(max(probabilities))
            
            return {
                'isSpam': bool(prediction),
                'confidence': confidence,
                'spamScore': spam_score
            }
        except Exception as e:
            print(f"Prediction error: {e}", file=sys.stderr)
            return {
                'isSpam': False,
                'confidence': 0.5,
                'spamScore': 0.5,
                'error': str(e)
            }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No email content provided"}))
        sys.exit(1)
    
    try:
        detector = SpamDetector()
        email = sys.argv[1]
        result = detector.predict(email)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)