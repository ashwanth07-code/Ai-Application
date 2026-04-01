import React, { useState, useRef, useEffect } from 'react';
import {
  Box, TextField, Button, Paper, Typography, CircularProgress,
  Avatar, IconButton, Fab, Zoom, Alert, Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import MicIcon from '@mui/icons-material/Mic';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChatBot = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [messages, setMessages] = useState([
    { 
      id: 1,
      text: "Hello! I'm your AI assistant. I can answer questions about technology, science, history, general knowledge, and more. How can I help you today?", 
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Comprehensive knowledge base for responses
  const getResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    // Greetings
    if (input.match(/\b(hello|hi|hey|greetings|good morning|good afternoon|good evening)\b/i)) {
      return "Hello! How can I assist you today?";
    }
    
    // How are you
    if (input.match(/\bhow are you|how do you do|how are things\b/i)) {
      return "I'm doing great, thanks for asking! How can I help you today?";
    }
    
    // Thanks
    if (input.match(/\b(thanks|thank you|appreciate|grateful)\b/i)) {
      return "You're welcome! Happy to help!";
    }
    
    // Farewell
    if (input.match(/\b(bye|goodbye|see you|take care|cya)\b/i)) {
      return "Goodbye! Feel free to come back if you have more questions.";
    }
    
    // AI Questions
    if (input.match(/\bwhat is ai|what is artificial intelligence|define ai|artificial intelligence definition\b/i)) {
      return "Artificial Intelligence (AI) is the simulation of human intelligence in machines that are programmed to think and learn. It encompasses various subfields like machine learning, natural language processing, computer vision, and robotics. AI systems can perceive their environment, reason about knowledge, process information, and take actions to achieve specific goals.";
    }
    
    // Machine Learning
    if (input.match(/\bwhat is machine learning|define machine learning|machine learning definition|what is ml\b/i)) {
      return "Machine Learning is a subset of AI that enables systems to automatically learn and improve from experience without being explicitly programmed. It uses algorithms to analyze data, identify patterns, and make decisions with minimal human intervention. Common applications include recommendation systems, fraud detection, and predictive analytics.";
    }
    
    // Deep Learning
    if (input.match(/\bwhat is deep learning|define deep learning|deep learning definition|neural networks\b/i)) {
      return "Deep Learning is a subset of machine learning based on artificial neural networks with multiple layers (hence 'deep'). These networks attempt to simulate the behavior of the human brain, allowing them to learn from large amounts of data. Deep learning powers many advanced AI applications like image recognition, natural language processing, and autonomous vehicles.";
    }
    
    // Solar System
    if (input.match(/\bsolar system|planets|sun|earth|mars|jupiter|saturn\b/i)) {
      return "The Solar System consists of the Sun and everything that orbits around it, including 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. The Sun contains 99.8% of the solar system's mass. Jupiter is the largest planet, while Mercury is the smallest. Earth is the only known planet to support life.";
    }
    
    // Black Hole
    if (input.match(/\bblack hole|blackhole|event horizon|singularity\b/i)) {
      return "A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even light—can escape from it. It forms when a massive star collapses under its own gravity. The boundary of a black hole is called the event horizon, and at its center lies a gravitational singularity where density becomes infinite.";
    }
    
    // DNA
    if (input.match(/\bwhat is dna|define dna|deoxyribonucleic acid|genetics\b/i)) {
      return "DNA (Deoxyribonucleic Acid) is a molecule that carries the genetic instructions used in the growth, development, functioning, and reproduction of all known living organisms. It consists of two long strands forming a double helix, each strand made up of nucleotides containing four bases: adenine (A), thymine (T), cytosine (C), and guanine (G).";
    }
    
    // Telephone Invention
    if (input.match(/\bwho invented telephone|inventor of telephone|alexander graham bell\b/i)) {
      return "Alexander Graham Bell is credited with inventing the first practical telephone in 1876. He was awarded the first US patent for the invention. Interestingly, there's controversy as Italian inventor Antonio Meucci had also developed a voice communication device earlier, but Bell received the patent.";
    }
    
    // World War 2
    if (input.match(/\bworld war 2|world war ii|second world war|ww2\b/i)) {
      return "World War II (1939-1945) was a global conflict involving most of the world's nations. It was the most widespread war in history, with more than 100 million people mobilized. The war resulted in an estimated 70-85 million fatalities, making it the deadliest conflict in human history. It ended with the defeat of the Axis powers and the creation of the United Nations.";
    }
    
    // Internet
    if (input.match(/\bwhat is internet|how does internet work|define internet\b/i)) {
      return "The Internet is a global network of billions of computers and other electronic devices. It works by using a standard set of protocols (TCP/IP) to connect networks worldwide. Information is broken into packets, sent across networks, and reassembled at their destination. It enables services like the World Wide Web, email, streaming, and more.";
    }
    
    // Cloud Computing
    if (input.match(/\bwhat is cloud computing|define cloud|cloud computing definition\b/i)) {
      return "Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ('the cloud') to offer faster innovation, flexible resources, and economies of scale. You typically pay only for cloud services you use, helping lower operating costs and scale as your business needs change.";
    }
    
    // Exercise Benefits
    if (input.match(/\bbenefits of exercise|why exercise|fitness benefits|workout benefits\b/i)) {
      return "Regular exercise provides numerous health benefits: it improves cardiovascular health, strengthens muscles and bones, helps with weight management, reduces risk of chronic diseases, boosts mental health and mood, improves sleep quality, and can increase your lifespan. Aim for at least 150 minutes of moderate activity per week!";
    }
    
    // Meditation
    if (input.match(/\bwhat is meditation|benefits of meditation|how to meditate\b/i)) {
      return "Meditation is a practice where an individual uses techniques like mindfulness or focusing the mind on a particular object, thought, or activity to achieve a mentally clear and emotionally calm state. Benefits include reduced stress, improved concentration, lower anxiety, enhanced self-awareness, better emotional health, and potential age-related memory benefits.";
    }
    
    // Python
    if (input.match(/\bwhat is python|python programming|python language\b/i)) {
      return "Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum and released in 1991, it emphasizes code readability with its notable use of significant whitespace. Python supports multiple programming paradigms and is widely used in web development, data science, AI, machine learning, and automation.";
    }
    
    // JavaScript
    if (input.match(/\bwhat is javascript|javascript language|js\b/i)) {
      return "JavaScript is a programming language that enables interactive web pages. It's an essential technology of the World Wide Web, alongside HTML and CSS. Originally created in 1995 by Brendan Eich, it's now used by 98% of websites for client-side behavior, and increasingly for server-side development through environments like Node.js.";
    }
    
    // Default response for unknown questions
    const defaultResponses = [
      "That's an interesting question! I'm still learning about that topic. Could you ask me about AI, science, technology, or history?",
      "I don't have information about that yet. Try asking me about artificial intelligence, machine learning, the solar system, or famous inventions!",
      "Great question! While I'm still developing, I can help you with topics like AI, programming, science facts, and historical events.",
      "I'm not sure about that specific topic. Feel free to ask me about what is AI, machine learning, black holes, or who invented the telephone!"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        setError('Speech recognition error: ' + event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition not supported in this browser. Please use Chrome.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      try {
        if (isListening) {
          recognitionRef.current.stop();
        } else {
          recognitionRef.current.start();
        }
      } catch (err) {
        setError('Could not start speech recognition');
        setIsListening(false);
      }
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { 
      id: Date.now(),
      text: input, 
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Get bot response
    const botResponse = getResponse(input);
    
    // Add bot message after a short delay to simulate thinking
    setLoading(true);
    setTimeout(() => {
      const botMessage = { 
        id: Date.now() + 1,
        text: botResponse, 
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 500);
    
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "Hello! I'm your AI assistant. I can answer questions about technology, science, history, general knowledge, and more. How can I help you today?", 
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const goToHome = () => {
    navigate('/');
  };

  // Suggested questions
  const suggestedQuestions = [
    "What is artificial intelligence?",
    "Tell me about the solar system",
    "Who invented the telephone?",
    "What is machine learning?",
    "Explain black holes",
    "What are the benefits of exercise?"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Auto focus on input after suggestion
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <Box sx={{ 
      height: '90vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at 10% 20%, #1a1a2e, #16213e, #0f3460)',
      p: 2
    }}>
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: '1200px',
          height: '90%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 4,
          background: 'linear-gradient(145deg, #1e1e2f, #2d2d44)',
          border: '1px solid #4a4a6a',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
        }}
      >
        {/* Header with gradient */}
        <Box sx={{ 
          p: 2, 
          background: 'linear-gradient(90deg, #6a1b9a, #4a148c, #2a0e5c)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          borderBottom: '2px solid #9575cd'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={goToHome}
              sx={{
                background: 'linear-gradient(45deg, #ff6b6b, #f03e3e)',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(255,107,107,0.5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #f03e3e, #c92a2a)',
                }
              }}
            >
              Back to Home
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PsychologyIcon sx={{ fontSize: 28, color: '#ffd700' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                AI ChatBot Assistant
              </Typography>
              <Chip 
                label="Online" 
                size="small" 
                sx={{ 
                  background: 'linear-gradient(45deg, #00b09b, #96c93d)',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,176,155,0.4)'
                }}
              />
            </Box>
          </Box>
          <IconButton 
            color="inherit" 
            onClick={clearChat} 
            title="Clear chat"
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
              }
            }}
          >
            <DeleteSweepIcon />
          </IconButton>
        </Box>

        {/* Scrollable Messages Area - Dark theme */}
        <Box 
          ref={chatContainerRef}
          sx={{ 
            flexGrow: 1,
            overflowY: 'auto',
            p: 3,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1e1e2f 100%)',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#2d2d44',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(45deg, #6a1b9a, #9575cd)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'linear-gradient(45deg, #9575cd, #6a1b9a)',
            },
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
                width: '100%'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                maxWidth: '70%',
                minWidth: '200px'
              }}>
                {message.sender === 'bot' && (
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #6a1b9a, #4a148c)',
                    boxShadow: '0 4px 10px rgba(106,27,154,0.5)',
                    mr: 1, 
                    flexShrink: 0 
                  }}>
                    <SmartToyIcon />
                  </Avatar>
                )}
                <Box sx={{ width: '100%' }}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 2,
                      background: message.sender === 'user' 
                        ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                        : 'linear-gradient(135deg, #2d2d44, #1e1e2f)',
                      color: message.sender === 'user' ? 'white' : '#e0e0e0',
                      borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                      wordBreak: 'break-word',
                      width: 'fit-content',
                      maxWidth: '100%',
                      border: message.sender === 'bot' ? '1px solid #4a4a6a' : 'none',
                      boxShadow: message.sender === 'user' 
                        ? '0 8px 16px rgba(240,147,251,0.3)'
                        : '0 8px 16px rgba(0,0,0,0.5)'
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                  </Paper>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      ml: 1, 
                      mt: 0.5, 
                      display: 'block',
                      color: '#a0a0c0'
                    }}
                  >
                    {message.timestamp}
                  </Typography>
                </Box>
                {message.sender === 'user' && (
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                    boxShadow: '0 4px 10px rgba(245,87,108,0.5)',
                    ml: 1, 
                    flexShrink: 0 
                  }}>
                    <PersonIcon />
                  </Avatar>
                )}
              </Box>
            </Box>
          ))}
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #6a1b9a, #4a148c)',
                mr: 1, 
                flexShrink: 0 
              }}>
                <SmartToyIcon />
              </Avatar>
              <Paper sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #2d2d44, #1e1e2f)',
                border: '1px solid #4a4a6a'
              }}>
                <CircularProgress size={20} sx={{ color: '#9575cd' }} />
              </Paper>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area - Dark theme */}
        <Box sx={{ 
          p: 2,
          background: 'linear-gradient(135deg, #2d2d44, #1a1a2e)',
          borderTop: '2px solid #4a4a6a',
          flexShrink: 0
        }}>
          
          {/* Suggested Questions */}
          {messages.length < 3 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', color: '#b0b0d0' }}>
                Try asking:
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                maxHeight: '60px',
                overflowY: 'auto'
              }}>
                {suggestedQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    onClick={() => handleSuggestionClick(question)}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #3d3d5a, #2d2d44)',
                      color: '#d0d0f0',
                      border: '1px solid #5d5d7a',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #6a1b9a, #4a148c)',
                        color: 'white',
                        border: '1px solid #9575cd',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(135deg, #c62828, #b71c1c)',
                color: 'white',
                '& .MuiAlert-icon': {
                  color: 'white'
                }
              }} 
              onClose={() => setError('')}
              size="small"
            >
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Zoom in={true}>
              <Fab
                size="small"
                onClick={handleVoiceInput}
                sx={{ 
                  flexShrink: 0,
                  width: '40px',
                  height: '40px',
                  background: isListening 
                    ? 'linear-gradient(135deg, #f093fb, #f5576c)'
                    : 'linear-gradient(135deg, #6a1b9a, #4a148c)',
                  color: 'white',
                  boxShadow: isListening 
                    ? '0 0 20px #f5576c'
                    : '0 4px 10px rgba(106,27,154,0.5)',
                  '&:hover': {
                    background: isListening 
                      ? 'linear-gradient(135deg, #f5576c, #f093fb)'
                      : 'linear-gradient(135deg, #4a148c, #6a1b9a)',
                  }
                }}
              >
                <MicIcon />
              </Fab>
            </Zoom>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask me anything about AI, science, history, technology..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              multiline
              maxRows={3}
              inputRef={inputRef}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#1e1e2f',
                  color: '#e0e0e0',
                  '& fieldset': {
                    borderColor: '#4a4a6a',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9575cd',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6a1b9a',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#8080a0',
                  opacity: 1,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              endIcon={<SendIcon />}
              sx={{ 
                minWidth: '100px',
                flexShrink: 0,
                background: 'linear-gradient(45deg, #6a1b9a, #4a148c)',
                color: 'white',
                boxShadow: '0 4px 10px rgba(106,27,154,0.5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4a148c, #6a1b9a)',
                },
                '&.Mui-disabled': {
                  background: '#3d3d5a',
                  color: '#8080a0',
                }
              }}
            >
              Send
            </Button>
          </Box>
          <Typography variant="caption" sx={{ 
            display: 'block', 
            mt: 1, 
            textAlign: 'center', 
            color: '#a0a0c0'
          }}>
            Press Enter to send • Shift+Enter for new line • Click mic for voice input
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatBot;