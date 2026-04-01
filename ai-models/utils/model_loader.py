"""
Model loading utilities
"""
import pickle
import joblib
import os
from pathlib import Path

class ModelLoader:
    def __init__(self, models_dir='models'):
        self.models_dir = Path(models_dir)
        self.models_dir.mkdir(exist_ok=True)
        self.loaded_models = {}
    
    def save_model(self, model, name, use_joblib=False):
        """Save model to disk"""
        path = self.models_dir / f"{name}.pkl"
        
        try:
            if use_joblib:
                joblib.dump(model, path)
            else:
                with open(path, 'wb') as f:
                    pickle.dump(model, f)
            print(f"Model saved to {path}")
            return str(path)
        except Exception as e:
            print(f"Error saving model: {e}")
            return None
    
    def load_model(self, name, use_joblib=False):
        """Load model from disk"""
        # Check if already loaded
        if name in self.loaded_models:
            return self.loaded_models[name]
        
        path = self.models_dir / f"{name}.pkl"
        
        if not path.exists():
            print(f"Model {name} not found at {path}")
            return None
        
        try:
            if use_joblib:
                model = joblib.load(path)
            else:
                with open(path, 'rb') as f:
                    model = pickle.load(f)
            
            self.loaded_models[name] = model
            print(f"Model loaded from {path}")
            return model
        except Exception as e:
            print(f"Error loading model: {e}")
            return None
    
    def list_models(self):
        """List all available models"""
        models = list(self.models_dir.glob('*.pkl'))
        return [model.stem for model in models]
    
    def delete_model(self, name):
        """Delete model from disk"""
        path = self.models_dir / f"{name}.pkl"
        
        if path.exists():
            path.unlink()
            if name in self.loaded_models:
                del self.loaded_models[name]
            print(f"Model {name} deleted")
            return True
        
        print(f"Model {name} not found")
        return False
    
    def clear_cache(self):
        """Clear loaded models from memory"""
        self.loaded_models.clear()
        print("Model cache cleared")

# Create singleton instance
model_loader = ModelLoader()