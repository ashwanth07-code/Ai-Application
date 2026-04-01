import React, { useState } from 'react';
import {
  Paper, Typography, TextField, Button, Box, Alert,
  Card, CardContent, LinearProgress, Chip, Grid,
  Tab, Tabs, IconButton, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HistoryIcon from '@mui/icons-material/History';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const QA_System = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  const askQuestion = async () => {
    if (!question.trim() || !context.trim()) {
      setError('Please enter both question and context');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/qa', {
        question,
        context
      });

      if (response.data.success) {
        setAnswer(response.data);
        setHistory(prev => [
          {
            id: Date.now(),
            question,
            answer: response.data.answer,
            confidence: response.data.confidence,
            timestamp: new Date().toLocaleString()
          },
          ...prev
        ]);
      } else {
        setError('Failed to get answer: ' + (response.data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Error connecting to server. Please make sure the backend is running on port 5000.');
      console.error('QA error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleContext = () => {
    setContext(
      "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals. The term 'artificial intelligence' had previously been used to describe machines that mimic and display 'human' cognitive skills that are associated with the human mind, such as 'learning' and 'problem-solving'. This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated. AI applications include advanced web search engines, recommendation systems, understanding human speech, self-driving cars, automated decision-making, and competing at the highest level in strategic game systems."
    );
    setQuestion("What is artificial intelligence?");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <Box sx={{ 
      height: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at 10% 20%, #1a1a2e, #16213e, #0f3460)',
      p: 3,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden'  // ← CHANGED: from 'auto' to 'hidden' to remove outside scrollbar
    }}>
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: '1200px',
          height: 'calc(80vh - 48px)',  // ← ADDED: Fixed height calculation
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          background: 'linear-gradient(145deg, #1e1e2f, #2d2d44)',
          border: '1px solid #4a4a6a',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          overflow: 'hidden'  // ← ADDED: Hide overflow at Paper level
        }}
      >
        {/* Header with Back to Home button - Fixed */}
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
              <QuestionAnswerIcon sx={{ fontSize: 28, color: '#ffd700' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                Q&A System
              </Typography>
              <Chip 
                label="Active" 
                size="small" 
                sx={{ 
                  background: 'linear-gradient(45deg, #00b09b, #96c93d)',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Scrollable Content Area - ONLY THIS SCROLLS */}
        <Box sx={{ 
          flexGrow: 1,
          overflowY: 'auto',  // ← This is the ONLY scrollbar in the entire page
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
        }}>
          
          <Box sx={{ borderBottom: 1, borderColor: '#4a4a6a', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, v) => setTabValue(v)}
              sx={{
                '& .MuiTab-root': { color: '#b0b0d0' },
                '& .Mui-selected': { color: '#ffd700' },
                '& .MuiTabs-indicator': { backgroundColor: '#ffd700' },
              }}
            >
              <Tab label="Ask Question" icon={<QuestionAnswerIcon />} iconPosition="start" />
              <Tab label="History" icon={<HistoryIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Your Question"
                  variant="outlined"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What is artificial intelligence?"
                  disabled={loading}
                  InputLabelProps={{
                    sx: { color: '#b0b0d0' }
                  }}
                  sx={{
                    mb: 2,
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
                    '& .MuiInputLabel-root': {
                      color: '#b0b0d0',
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={askQuestion}
                    disabled={loading || !question.trim() || !context.trim()}
                    sx={{ 
                      flexGrow: 1,
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
                    {loading ? <LinearProgress sx={{ width: 100, color: 'white' }} /> : 'Ask Question'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={loadSampleContext}
                    sx={{
                      borderColor: '#9575cd',
                      color: '#9575cd',
                      '&:hover': {
                        borderColor: '#6a1b9a',
                        color: '#6a1b9a',
                        background: 'rgba(106,27,154,0.1)',
                      }
                    }}
                  >
                    Sample
                  </Button>
                </Box>

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
                  >
                    {error}
                  </Alert>
                )}
              </Grid>

              <Grid item xs={12} md={7}>
                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  label="Context Document"
                  variant="outlined"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Paste your document text here..."
                  disabled={loading}
                  InputLabelProps={{
                    sx: { color: '#b0b0d0' }
                  }}
                  helperText="The AI will search for answers within this context"
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
                    '& .MuiFormHelperText-root': {
                      color: '#b0b0d0',
                      background: 'rgba(106,27,154,0.1)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginTop: '4px',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                {answer && answer.success && (
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #2d2d44, #1e1e2f)',
                    border: '1px solid #4a4a6a',
                    borderRadius: 2
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: '#96c93d' }}>
                          Answer Found! ✅
                        </Typography>
                        <Tooltip title="Copy answer">
                          <IconButton 
                            onClick={() => copyToClipboard(answer.answer)} 
                            size="small"
                            sx={{ color: '#ffd700' }}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      <Paper sx={{ 
                        p: 3, 
                        background: '#1e1e2f',
                        mb: 2,
                        borderRadius: 1,
                        border: '1px solid #4a4a6a',
                        color: '#e0e0e0',
                        maxHeight: '200px',
                        overflow: 'auto',  // ← ADDED: Internal scroll for long answers
                        '&::-webkit-scrollbar': {
                          width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: '#2d2d44',
                          borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'linear-gradient(45deg, #6a1b9a, #9575cd)',
                          borderRadius: '3px',
                        },
                      }}>
                        <Typography variant="body1">
                          {answer.answer}
                        </Typography>
                      </Paper>
                      
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Chip 
                          label={`Confidence: ${(answer.confidence * 100).toFixed(1)}%`}
                          sx={{
                            background: answer.confidence > 0.8 
                              ? 'linear-gradient(45deg, #00b09b, #96c93d)'
                              : answer.confidence > 0.5 
                                ? 'linear-gradient(45deg, #ffd700, #ffb300)'
                                : 'linear-gradient(45deg, #f093fb, #f5576c)',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Box>
              {history.length > 0 ? (
                <Grid 
                  container 
                  spacing={2}
                  sx={{
                    maxHeight: 'calc(100vh - 280px)',  // ← ADDED: Fixed height for history section
                    overflow: 'auto',  // ← ADDED: Scroll only within history section
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#2d2d44',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'linear-gradient(45deg, #6a1b9a, #9575cd)',
                      borderRadius: '3px',
                    },
                  }}
                >
                  {history.map((item) => (
                    <Grid item xs={12} key={item.id}>
                      <Card sx={{ 
                        background: 'linear-gradient(135deg, #2d2d44, #1e1e2f)',
                        border: '1px solid #4a4a6a',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: '#b0b0d0' }}>
                              {item.timestamp}
                            </Typography>
                            <Chip 
                              size="small"
                              label={`${(item.confidence * 100).toFixed(1)}% confidence`}
                              sx={{
                                background: item.confidence > 0.8 
                                  ? 'linear-gradient(45deg, #00b09b, #96c93d)'
                                  : item.confidence > 0.5 
                                    ? 'linear-gradient(45deg, #ffd700, #ffb300)'
                                    : 'linear-gradient(45deg, #f093fb, #f5576c)',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>
                          <Typography variant="subtitle1" gutterBottom sx={{ color: '#ffd700' }}>
                            <strong>Q:</strong> {item.question}
                          </Typography>
                          <Paper sx={{ 
                            p: 2, 
                            background: '#1e1e2f',
                            mb: 1,
                            borderRadius: 1,
                            border: '1px solid #4a4a6a',
                            color: '#e0e0e0',
                            maxHeight: '80px',
                            overflow: 'auto',  // ← ADDED: Scroll for long answers in history
                            '&::-webkit-scrollbar': {
                              width: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                              background: '#2d2d44',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: 'linear-gradient(45deg, #6a1b9a, #9575cd)',
                            },
                          }}>
                            <Typography variant="body2">
                              <strong>A:</strong> {item.answer}
                            </Typography>
                          </Paper>
                          <Button 
                            size="small" 
                            startIcon={<ContentCopyIcon />}
                            onClick={() => copyToClipboard(item.answer)}
                            sx={{ 
                              color: '#9575cd',
                              '&:hover': {
                                color: '#6a1b9a',
                              }
                            }}
                          >
                            Copy Answer
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info" sx={{ 
                  background: 'linear-gradient(135deg, #2d2d44, #1e1e2f)',
                  color: '#b0b0d0',
                  border: '1px solid #4a4a6a'
                }}>
                  No question history yet. Ask some questions to see them here!
                </Alert>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default QA_System;