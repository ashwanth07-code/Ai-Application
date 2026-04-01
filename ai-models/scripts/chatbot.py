#!/usr/bin/env python3
"""
AI ChatBot using DialoGPT
"""
import sys
import json
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import warnings
warnings.filterwarnings('ignore')

class AIAssistant:
    def __init__(self):
        self.model_name = "microsoft/DialoGPT-medium"
        print(f"Loading model {self.model_name}...", file=sys.stderr)
        
        try:
            # Load tokenizer and model
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForCausalLM.from_pretrained(self.model_name)
            
            # Add padding token if not present
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
                
            self.chat_history_ids = None
            print("Model loaded successfully!", file=sys.stderr)
        except Exception as e:
            print(f"Error loading model: {e}", file=sys.stderr)
            sys.exit(1)
        
    def generate_response(self, message):
        try:
            # Encode the new user input
            new_input_ids = self.tokenizer.encode(
                message + self.tokenizer.eos_token, 
                return_tensors='pt',
                truncation=True,
                max_length=512
            )
            
            # Append to the chat history
            if self.chat_history_ids is not None:
                bot_input_ids = torch.cat([self.chat_history_ids, new_input_ids], dim=-1)
            else:
                bot_input_ids = new_input_ids
            
            # Generate response with better parameters
            with torch.no_grad():
                self.chat_history_ids = self.model.generate(
                    bot_input_ids,
                    max_length=1000,
                    pad_token_id=self.tokenizer.eos_token_id,
                    no_repeat_ngram_size=3,
                    do_sample=True,
                    top_k=50,
                    top_p=0.95,
                    temperature=0.7,
                    num_return_sequences=1
                )
            
            # Decode response
            response = self.tokenizer.decode(
                self.chat_history_ids[:, bot_input_ids.shape[-1]:][0], 
                skip_special_tokens=True
            )
            
            # Handle empty response
            if not response.strip():
                response = "I'm not sure how to respond to that. Could you rephrase?"
            
            return response
            
        except Exception as e:
            print(f"Error generating response: {e}", file=sys.stderr)
            return "I encountered an error processing your request. Please try again."

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No message provided"}))
        sys.exit(1)
    
    try:
        assistant = AIAssistant()
        message = sys.argv[1]
        response = assistant.generate_response(message)
        print(response)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)