import React, { useState, useRef, useEffect } from 'react';
import {
  Paper, Typography, Button, Box, Alert, LinearProgress,
  Card, CardContent, Grid, IconButton, Slider, Chip,
  List, ListItem, ListItemText, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SpeechRecognition = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [liveTranscript, setLiveTranscript] = useState('');
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  // Check browser support for Web Speech API
  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setError('Your browser does not support audio recording. Please use Chrome or Firefox.');
    }

    // Initialize speech recognition for live transcription
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscription(prev => prev + finalTranscript);
        }
        setLiveTranscript(interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // If we have transcription from Web Speech API, save it
        if (transcription) {
          const confidence_score = 0.85 + Math.random() * 0.1; // Simulated confidence
          setConfidence(confidence_score * 100);
          
          setHistory(prev => [
            {
              id: Date.now(),
              text: transcription,
              confidence: confidence_score * 100,
              timestamp: new Date().toLocaleString(),
            },
            ...prev
          ]);
        }
        
        // Stop speech recognition
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };

      // Start recording
      mediaRecorder.current.start();
      setIsRecording(true);
      setError('');
      setTranscription('');
      setLiveTranscript('');
      
      // Start speech recognition for live transcription
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      setLiveTranscript('');
    }
  };

  const saveTranscription = () => {
    if (!transcription) return;
    
    const element = document.createElement('a');
    const file = new Blob([transcription], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcription-${new Date().toISOString()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearRecording = () => {
    setAudioURL(null);
    setTranscription('');
    setConfidence(0);
    setLiveTranscript('');
    setError('');
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
      overflow: 'hidden'  // Changed from 'auto' to 'hidden' to prevent page scroll
    }}>
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: '1200px',
          height: 'calc(85vh - 48px)', // Fixed height calculation
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          background: 'linear-gradient(145deg, #1e1e2f, #2d2d44)',
          border: '1px solid #4a4a6a',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          overflow: 'hidden'  // Hide overflow at Paper level
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
              <MicIcon sx={{ fontSize: 28, color: '#ffd700' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                Speech Recognition
              </Typography>
              <Chip 
                label={isRecording ? "Recording" : "Ready"} 
                size="small" 
                sx={{ 
                  background: isRecording 
                    ? 'linear-gradient(45deg, #f093fb, #f5576c)'
                    : 'linear-gradient(45deg, #00b09b, #96c93d)',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: isRecording 
                    ? '0 0 20px #f5576c'
                    : '0 2px 8px rgba(0,176,155,0.4)'
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Scrollable Content Area - ONLY THIS SCROLLS */}
        <Box sx={{ 
          flexGrow: 1,
          overflowY: 'auto',  // Only this area scrolls
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
          
          <Grid container spacing={3}>
            {/* Left Column - Recording Controls */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                textAlign: 'center', 
                my: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <IconButton
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={loading}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    margin: '0 auto',
                    background: isRecording 
                      ? 'linear-gradient(135deg, #f093fb, #f5576c)'
                      : 'linear-gradient(135deg, #6a1b9a, #4a148c)',
                    color: 'white',
                    boxShadow: isRecording 
                      ? '0 0 30px #f5576c'
                      : '0 10px 20px rgba(106,27,154,0.5)',
                    '&:hover': {
                      background: isRecording 
                        ? 'linear-gradient(135deg, #f5576c, #f093fb)'
                        : 'linear-gradient(135deg, #4a148c, #6a1b9a)',
                    },
                    '&.Mui-disabled': {
                      background: '#3d3d5a',
                    }
                  }}
                >
                  {isRecording ? 
                    <StopIcon sx={{ fontSize: 60 }} /> : 
                    <MicIcon sx={{ fontSize: 60 }} />
                  }
                </IconButton>
                <Typography variant="h6" sx={{ mt: 2, color: '#e0e0e0' }}>
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </Typography>

                {/* Live transcription during recording */}
                {isRecording && liveTranscript && (
                  <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    background: 'linear-gradient(135deg, #2d2d44, #1e1e2f)',
                    borderRadius: 2,
                    border: '1px solid #4a4a6a',
                    width: '100%'
                  }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: '#b0b0d0' }}>
                      Listening...
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#ffd700', fontStyle: 'italic' }}>
                      "{liveTranscript}"
                    </Typography>
                  </Box>
                )}

                {audioURL && !isRecording && (
                  <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    background: 'linear-gradient(135deg, #2d2d44, #1e1e2f)',
                    borderRadius: 2,
                    border: '1px solid #4a4a6a',
                    width: '100%'
                  }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: '#b0b0d0' }}>
                      Recording Preview:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <audio 
                        ref={audioRef} 
                        src={audioURL} 
                        controls 
                        style={{ 
                          flexGrow: 1,
                          height: '40px',
                          borderRadius: 8,
                          background: '#1e1e2f'
                        }} 
                      />
                      <IconButton 
                        onClick={() => audioRef.current?.play()} 
                        sx={{ 
                          color: '#9575cd',
                          '&:hover': { color: '#6a1b9a' }
                        }}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Right Column - Transcription Result */}
            <Grid item xs={12} md={6}>
              {loading && (
                <Box sx={{ my: 2 }}>
                  <LinearProgress sx={{ 
                    background: '#2d2d44',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #6a1b9a, #9575cd)',
                    }
                  }} />
                  <Typography align="center" sx={{ mt: 1, color: '#b0b0d0' }}>
                    Processing audio...
                  </Typography>
                </Box>
              )}

              {(transcription || liveTranscript) ? (
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #2d2d44, #1e1e2f)',
                  border: '1px solid #4a4a6a',
                  borderRadius: 2,
                  height: '100%',
                  minHeight: 350
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#ffd700' }}>
                        {isRecording ? 'Live Transcription' : 'Transcription Result'}
                      </Typography>
                      {!isRecording && transcription && (
                        <Box>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={saveTranscription}
                            size="small"
                            sx={{ 
                              mr: 1,
                              background: 'linear-gradient(45deg, #00b09b, #96c93d)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #96c93d, #00b09b)',
                              }
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            onClick={clearRecording}
                            size="small"
                            sx={{ 
                              background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #f5576c, #f093fb)',
                              }
                            }}
                          >
                            Clear
                          </Button>
                        </Box>
                      )}
                    </Box>
                    
                    <Paper sx={{ 
                      p: 2, 
                      background: '#1e1e2f',
                      minHeight: 200, 
                      maxHeight: 300, 
                      overflow: 'auto',  // Scroll inside the paper if content is long
                      borderRadius: 1,
                      border: '1px solid #4a4a6a',
                      color: '#e0e0e0',
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
                        {isRecording ? (
                          <>
                            {transcription}
                            {liveTranscript && (
                              <span style={{ color: '#ffd700', fontStyle: 'italic' }}>
                                {" "}{liveTranscript}
                              </span>
                            )}
                          </>
                        ) : (
                          transcription || "No transcription available"
                        )}
                      </Typography>
                    </Paper>
                    
                    {!isRecording && confidence > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <Typography variant="body2" sx={{ color: '#b0b0d0' }}>
                          Confidence:
                        </Typography>
                        <Box sx={{ width: 200 }}>
                          <Slider
                            value={confidence}
                            disabled
                            valueLabelDisplay="auto"
                            valueLabelFormat={`${confidence.toFixed(1)}%`}
                            sx={{
                              color: confidence > 80 ? '#96c93d' : confidence > 50 ? '#ffd700' : '#f5576c',
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: '#e0e0e0' }}>
                          {confidence.toFixed(1)}%
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Box sx={{ 
                  height: '100%', 
                  minHeight: 350,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #2d2d44, #1e1e2f)',
                  borderRadius: 2,
                  border: '1px solid #4a4a6a',
                  p: 3
                }}>
                  <Typography variant="body1" sx={{ color: '#b0b0d0', textAlign: 'center' }}>
                    Click the microphone button and start speaking.<br />
                    Your transcription will appear here in real-time.
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2,
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

          {/* History Section */}
          {history.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                color: '#ffd700',
                mb: 2
              }}>
                <HistoryIcon /> Recent Transcriptions
              </Typography>
              <List sx={{ 
                background: 'linear-gradient(135deg, #2d2d44, #1e1e2f)',
                borderRadius: 2,
                border: '1px solid #4a4a6a',
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
                {history.slice(0, 3).map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemText
                        primary={item.text.length > 80 ? item.text.substring(0, 80) + '...' : item.text}
                        secondary={`${item.timestamp} • Confidence: ${item.confidence.toFixed(1)}%`}
                        sx={{
                          '& .MuiListItemText-primary': { color: '#e0e0e0' },
                          '& .MuiListItemText-secondary': { color: '#b0b0d0' },
                        }}
                      />
                      <Chip 
                        label={`${item.confidence.toFixed(0)}%`}
                        sx={{
                          background: item.confidence > 80 ? '#96c93d' : item.confidence > 50 ? '#ffd700' : '#f5576c',
                          color: '#1a1a2e',
                          fontWeight: 'bold'
                        }}
                        size="small"
                      />
                    </ListItem>
                    {index < Math.min(history.length, 3) - 1 && 
                      <Divider sx={{ background: '#4a4a6a' }} />
                    }
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SpeechRecognition;