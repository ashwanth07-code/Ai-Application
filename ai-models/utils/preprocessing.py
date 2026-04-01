"""
Text preprocessing utilities for AI models
"""
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer, PorterStemmer

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')

class TextPreprocessor:
    def __init__(self, use_lemmatization=True):
        self.stop_words = set(stopwords.words('english'))
        self.use_lemmatization = use_lemmatization
        
        if use_lemmatization:
            self.lemmatizer = WordNetLemmatizer()
        else:
            self.stemmer = PorterStemmer()
    
    def clean_text(self, text):
        """Basic text cleaning"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def tokenize(self, text):
        """Tokenize text"""
        return nltk.word_tokenize(text)
    
    def remove_stopwords(self, tokens):
        """Remove stopwords from tokens"""
        return [token for token in tokens if token not in self.stop_words]
    
    def lemmatize(self, tokens):
        """Lemmatize tokens"""
        return [self.lemmatizer.lemmatize(token) for token in tokens]
    
    def stem(self, tokens):
        """Stem tokens"""
        return [self.stemmer.stem(token) for token in tokens]
    
    def process(self, text):
        """Full preprocessing pipeline"""
        # Clean text
        cleaned = self.clean_text(text)
        
        # Tokenize
        tokens = self.tokenize(cleaned)
        
        # Remove stopwords
        tokens = self.remove_stopwords(tokens)
        
        # Apply lemmatization or stemming
        if self.use_lemmatization:
            tokens = self.lemmatize(tokens)
        else:
            tokens = self.stem(tokens)
        
        # Join back into text
        return ' '.join(tokens)
    
    def process_batch(self, texts):
        """Process multiple texts"""
        return [self.process(text) for text in texts]

# Create singleton instance
preprocessor = TextPreprocessor()