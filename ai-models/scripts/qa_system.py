#!/usr/bin/env python3
"""
Question Answering System using Transformers
"""
import sys
import json
from transformers import pipeline, AutoModelForQuestionAnswering, AutoTokenizer
import torch
import warnings
warnings.filterwarnings('ignore')

class QASystem:
    def __init__(self):
        self.model_name = "distilbert-base-cased-distilled-squad"
        print(f"Loading QA model {self.model_name}...", file=sys.stderr)
        
        try:
            self.qa_pipeline = pipeline(
                "question-answering",
                model=self.model_name,
                tokenizer=self.model_name,
                device=0 if torch.cuda.is_available() else -1
            )
            print("Model loaded successfully!", file=sys.stderr)
        except Exception as e:
            print(f"Error loading model: {e}", file=sys.stderr)
            sys.exit(1)
        
    def answer_question(self, question, context):
        try:
            result = self.qa_pipeline({
                'question': question,
                'context': context
            })
            
            return {
                'success': True,
                'answer': result['answer'],
                'confidence': result['score'],
                'start': result['start'],
                'end': result['end']
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def answer_from_multiple_contexts(self, question, contexts):
        """Answer question from multiple context documents"""
        best_answer = None
        best_score = 0
        
        for context in contexts:
            result = self.answer_question(question, context)
            if result['success'] and result['confidence'] > best_score:
                best_score = result['confidence']
                best_answer = result
        
        if best_answer:
            return best_answer
        else:
            return {
                'success': False,
                'error': 'No confident answer found'
            }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No input data provided"}))
        sys.exit(1)
    
    try:
        qa_system = QASystem()
        data = json.loads(sys.argv[1])
        
        if isinstance(data.get('context'), list):
            result = qa_system.answer_from_multiple_contexts(
                data['question'], 
                data['context']
            )
        else:
            result = qa_system.answer_question(
                data['question'], 
                data.get('context', '')
            )
        
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)