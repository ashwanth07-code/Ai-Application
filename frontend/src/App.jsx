import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  AppBar, Toolbar, Typography, Container, Grid, Card, 
  CardContent, CardActions, Button, CssBaseline, Box,
  IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Avatar, Divider, Chip, Fade, Zoom
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import MicIcon from '@mui/icons-material/Mic';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HomeIcon from '@mui/icons-material/Home';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SecurityIcon from '@mui/icons-material/Security';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import QuizIcon from '@mui/icons-material/Quiz';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChatBot from './components/ChatBot';
import SpamFilter from './components/SpamFilter';
import SpeechRecognition from './components/SpeechRecognition';
import QA_System from './components/QA_System';

// Clean AI-Themed Home Component
function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);

  // Professional dark color palette
  const colors = {
    darkBg: '#0A0A0F',
    darkerBg: '#050508',
    cardBg: '#12121A',
    cardBorder: '#2A2A35',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0C0',
    accent1: '#3B82F6', // Blue - AI
    accent2: '#10B981', // Green - Security
    accent3: '#8B5CF6', // Purple - Voice
    accent4: '#F59E0B', // Amber - Q&A
    glow1: 'rgba(59, 130, 246, 0.2)',
    glow2: 'rgba(16, 185, 129, 0.2)',
    glow3: 'rgba(139, 92, 246, 0.2)',
    glow4: 'rgba(245, 158, 11, 0.2)'
  };

  const features = [
    { 
      id: 1,
      title: 'AI ChatBot', 
      description: 'Intelligent conversational AI that understands context and provides helpful responses.',
      path: '/chatbot', 
      icon: <SmartToyIcon />,
      accent: colors.accent1,
      glow: colors.glow1,
      gradient: `linear-gradient(135deg, ${colors.accent1} 0%, #2563EB 100%)`,
      delay: 100
    },
    { 
      id: 2,
      title: 'Spam Filter', 
      description: 'Advanced email spam detection using machine learning algorithms.',
      path: '/spam-filter', 
      icon: <SecurityIcon />,
      accent: colors.accent2,
      glow: colors.glow2,
      gradient: `linear-gradient(135deg, ${colors.accent2} 0%, #059669 100%)`,
      delay: 200
    },
    { 
      id: 3,
      title: 'Speech Recognition', 
      description: 'Real-time speech to text conversion with high accuracy.',
      path: '/speech', 
      icon: <RecordVoiceOverIcon />,
      accent: colors.accent3,
      glow: colors.glow3,
      gradient: `linear-gradient(135deg, ${colors.accent3} 0%, #7C3AED 100%)`,
      delay: 300
    },
    { 
      id: 4,
      title: 'Q&A System', 
      description: 'Document-based question answering using state-of-the-art NLP.',
      path: '/qa', 
      icon: <QuizIcon />,
      accent: colors.accent4,
      glow: colors.glow4,
      gradient: `linear-gradient(135deg, ${colors.accent4} 0%, #D97706 100%)`,
      delay: 400
    },
  ];

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: `radial-gradient(circle at 50% 50%, ${colors.darkBg} 0%, ${colors.darkerBg} 100%)`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* AI Neural Network Background Animation */}
      
      {/* Floating Data Streams */}
      {[...Array(20)].map((_, i) => (
        <Box
          key={`stream-${i}`}
          sx={{
            position: 'absolute',
            width: '2px',
            height: '100px',
            background: `linear-gradient(180deg, transparent, ${i % 4 === 0 ? colors.accent1 : i % 4 === 1 ? colors.accent2 : i % 4 === 2 ? colors.accent3 : colors.accent4})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.15,
            filter: 'blur(1px)',
            animation: `dataStream ${8 + i * 2}s linear infinite`,
            animationDelay: `${i * 0.5}s`,
            transform: 'rotate(45deg)',
            '@keyframes dataStream': {
              '0%': {
                transform: 'translateY(-100vh) rotate(45deg)',
                opacity: 0
              },
              '10%': {
                opacity: 0.3
              },
              '90%': {
                opacity: 0.3
              },
              '100%': {
                transform: 'translateY(100vh) rotate(45deg)',
                opacity: 0
              }
            }
          }}
        />
      ))}

      {/* Pulsing AI Cores */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={`core-${i}`}
          sx={{
            position: 'absolute',
            width: `${200 + i * 50}px`,
            height: `${200 + i * 50}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${i === 0 ? colors.glow1 : i === 1 ? colors.glow2 : i === 2 ? colors.glow3 : colors.glow4}, transparent 70%)`,
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
            opacity: 0.1,
            filter: 'blur(40px)',
            animation: `pulseCore ${6 + i * 2}s ease-in-out infinite`,
            '@keyframes pulseCore': {
              '0%, 100%': {
                transform: 'scale(1)',
                opacity: 0.1
              },
              '50%': {
                transform: 'scale(1.2)',
                opacity: 0.2
              }
            }
          }}
        />
      ))}

      {/* Binary Code Rain Effect */}
      {[...Array(30)].map((_, i) => (
        <Box
          key={`binary-${i}`}
          sx={{
            position: 'absolute',
            color: i % 4 === 0 ? colors.accent1 : i % 4 === 1 ? colors.accent2 : i % 4 === 2 ? colors.accent3 : colors.accent4,
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.1,
            animation: `binaryRain ${15 + i * 2}s linear infinite`,
            animationDelay: `${i * 0.3}s`,
            whiteSpace: 'nowrap',
            '@keyframes binaryRain': {
              '0%': {
                transform: 'translateY(-100vh)',
                opacity: 0
              },
              '10%': {
                opacity: 0.2
              },
              '90%': {
                opacity: 0.2
              },
              '100%': {
                transform: 'translateY(100vh)',
                opacity: 0
              }
            }
          }}
        >
          {Math.random() > 0.5 ? '01' : '10'} {Math.random() > 0.5 ? '101' : '010'} {Math.random() > 0.5 ? '0011' : '1100'}
        </Box>
      ))}

      {/* Neural Network Connection Lines */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          opacity: 0.1
        }}
      >
        {[...Array(15)].map((_, i) => {
          const x1 = Math.random() * 100;
          const y1 = Math.random() * 100;
          const x2 = Math.random() * 100;
          const y2 = Math.random() * 100;
          return (
            <line
              key={`line-${i}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={i % 4 === 0 ? colors.accent1 : i % 4 === 1 ? colors.accent2 : i % 4 === 2 ? colors.accent3 : colors.accent4}
              strokeWidth="1"
              strokeDasharray="5,5"
              style={{
                animation: `lineGlow ${10 + i * 2}s linear infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          );
        })}
      </svg>

      {/* Rotating AI Orb */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          border: '2px solid rgba(59, 130, 246, 0.05)',
          animation: 'rotateOrb 60s linear infinite',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '2px solid rgba(139, 92, 246, 0.05)',
            animation: 'rotateOrbReverse 40s linear infinite'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '2px solid rgba(16, 185, 129, 0.05)',
            animation: 'rotateOrb 30s linear infinite'
          },
          '@keyframes rotateOrb': {
            '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
            '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
          },
          '@keyframes rotateOrbReverse': {
            '0%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
            '100%': { transform: 'translate(-50%, -50%) rotate(0deg)' }
          }
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
        {/* Header Section - Simplified */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ 
            mb: 4, 
            textAlign: 'center'
          }}>
            <Zoom in={true} timeout={800}>
              <Chip 
                label="AI PLATFORM" 
                sx={{ 
                  mb: 2,
                  background: 'rgba(255,255,255,0.03)',
                  color: colors.textSecondary,
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontWeight: 500,
                  letterSpacing: '2px',
                  fontSize: '0.8rem',
                  py: 2,
                  px: 3
                }}
              />
            </Zoom>
            
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 600,
                color: colors.textPrimary,
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 1,
                letterSpacing: '-0.02em'
              }}
            >
              AI Applications
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: colors.textSecondary,
                maxWidth: '500px',
                mx: 'auto',
                fontSize: '0.95rem'
              }}
            >
              Four powerful AI tools to enhance your workflow
            </Typography>
          </Box>
        </Fade>

        {/* Features Grid - Perfectly Aligned Cards with Oval Buttons */}
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            width: '100%',
            margin: 0,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {features.map((feature) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3} 
              key={feature.id}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Zoom in={true} style={{ transitionDelay: `${feature.delay}ms` }}>
                <Card 
                  sx={{ 
                    width: '280px',
                    height: '360px',
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: feature.accent,
                      boxShadow: `0 20px 30px -10px ${feature.accent}`,
                      '& .card-glow': {
                        opacity: 0.15
                      },
                      '& .card-icon': {
                        transform: 'scale(1.05)',
                      }
                    }
                  }}
                  onMouseEnter={() => setHoveredCard(feature.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Animated Glow Overlay */}
                  <Box
                    className="card-glow"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: `radial-gradient(circle at 50% 0%, ${feature.glow}, transparent 70%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Top Accent Bar */}
                  <Box sx={{ 
                    height: '4px', 
                    background: feature.gradient,
                    width: '100%',
                    flexShrink: 0
                  }} />

                  {/* Content Container */}
                  <Box sx={{ 
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}>
                    {/* Icon */}
                    <Box sx={{ 
                      mb: 2
                    }}>
                      <Avatar
                        className="card-icon"
                        sx={{
                          width: 52,
                          height: 52,
                          background: feature.gradient,
                          color: 'white',
                          transition: 'all 0.3s ease',
                          boxShadow: `0 8px 16px -4px ${feature.accent}`,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                    </Box>

                    {/* Title */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: colors.textPrimary,
                        mb: 1,
                        fontSize: '1.1rem'
                      }}
                    >
                      {feature.title}
                    </Typography>

                    {/* Description - Fixed height */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colors.textSecondary,
                        lineHeight: 1.5,
                        fontSize: '0.85rem',
                        height: '65px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        mb: 1
                      }}
                    >
                      {feature.description}
                    </Typography>

                    {/* Try it Now Button - Oval Shape */}
                    <Box sx={{ 
                      mt: 'auto',
                      pt: 1,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <Button
                        component={Link}
                        to={feature.path}
                        variant="outlined"
                        sx={{
                          color: feature.accent,
                          borderColor: feature.accent,
                          backgroundColor: 'transparent',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          py: 0.5,
                          px: 2.5,
                          borderRadius: '50px', // Oval shape
                          minWidth: 'auto',
                          textTransform: 'none',
                          letterSpacing: '0.5px',
                          borderWidth: '1.5px',
                          '&:hover': {
                            backgroundColor: feature.accent,
                            color: '#FFFFFF',
                            borderColor: feature.accent,
                            transform: 'scale(1.02)',
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Try it Now
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CSS for additional animations */}
      <style>
        {`
          @keyframes floatParticle {
            0%, 100% { transform: translate(0, 0); opacity: 0.2; }
            50% { transform: translate(10px, -10px); opacity: 0.4; }
          }
          @keyframes lineGlow {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
          }
        `}
      </style>
    </Box>
  );
}

// Main App Component with Router - Fixed Structure
function AppContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState('dark');
  const location = useLocation();

  const colors = {
    black: '#0A0A0F',
    gold: '#3B82F6',
    white: '#FFFFFF',
    accent1: '#3B82F6',
    accent2: '#10B981',
    accent3: '#8B5CF6',
    accent4: '#F59E0B'
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#3B82F6' },
      secondary: { main: '#8B5CF6' },
      background: { default: '#0A0A0F', paper: '#12121A' },
      text: { primary: '#FFFFFF', secondary: '#B0B0C0' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: { borderRadius: 12 },
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', bgcolor: colors.black, height: '100%' }}>
      <Typography variant="h6" sx={{ my: 2, color: colors.gold, fontWeight: 600 }}>
        AI Platform
      </Typography>
      <Divider sx={{ bgcolor: '#2A2A35' }} />
      <List>
        <ListItem 
          button 
          component={Link} 
          to="/"
          sx={{
            bgcolor: isActive('/') ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' }
          }}
        >
          <ListItemIcon sx={{ color: isActive('/') ? colors.gold : colors.white }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" sx={{ color: colors.white }} />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/chatbot"
          sx={{
            bgcolor: isActive('/chatbot') ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' }
          }}
        >
          <ListItemIcon sx={{ color: isActive('/chatbot') ? colors.accent1 : colors.white }}>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="ChatBot" sx={{ color: colors.white }} />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/spam-filter"
          sx={{
            bgcolor: isActive('/spam-filter') ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' }
          }}
        >
          <ListItemIcon sx={{ color: isActive('/spam-filter') ? colors.accent2 : colors.white }}>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText primary="Spam Filter" sx={{ color: colors.white }} />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/speech"
          sx={{
            bgcolor: isActive('/speech') ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
            '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.1)' }
          }}
        >
          <ListItemIcon sx={{ color: isActive('/speech') ? colors.accent3 : colors.white }}>
            <MicIcon />
          </ListItemIcon>
          <ListItemText primary="Speech Recognition" sx={{ color: colors.white }} />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/qa"
          sx={{
            bgcolor: isActive('/qa') ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
            '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)' }
          }}
        >
          <ListItemIcon sx={{ color: isActive('/qa') ? colors.accent4 : colors.white }}>
            <QuestionAnswerIcon />
          </ListItemIcon>
          <ListItemText primary="Q&A System" sx={{ color: colors.white }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      {/* Navigation Bar with Working Buttons */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          background: 'transparent',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          zIndex: 1000
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: colors.white }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              color: colors.white,
              letterSpacing: '-0.5px',
            }}
          >
            AI<span style={{ color: colors.gold }}>Platform</span>
          </Typography>

          <IconButton 
            color="inherit" 
            onClick={toggleTheme}
            sx={{ color: colors.white }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Desktop Navigation - Working Buttons */}
          <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 2 }}>
            <Button 
              component={Link} 
              to="/"
              sx={{
                mx: 0.5,
                color: isActive('/') ? colors.gold : colors.white,
                borderBottom: isActive('/') ? `2px solid ${colors.gold}` : 'none',
                borderRadius: 0,
                '&:hover': {
                  color: colors.gold,
                  background: 'transparent'
                }
              }}
            >
              Home
            </Button>
            <Button 
              component={Link} 
              to="/chatbot"
              sx={{
                mx: 0.5,
                color: isActive('/chatbot') ? colors.accent1 : colors.white,
                borderBottom: isActive('/chatbot') ? `2px solid ${colors.accent1}` : 'none',
                borderRadius: 0,
                '&:hover': {
                  color: colors.accent1,
                  background: 'transparent'
                }
              }}
            >
              ChatBot
            </Button>
            <Button 
              component={Link} 
              to="/spam-filter"
              sx={{
                mx: 0.5,
                color: isActive('/spam-filter') ? colors.accent2 : colors.white,
                borderBottom: isActive('/spam-filter') ? `2px solid ${colors.accent2}` : 'none',
                borderRadius: 0,
                '&:hover': {
                  color: colors.accent2,
                  background: 'transparent'
                }
              }}
            >
              Spam
            </Button>
            <Button 
              component={Link} 
              to="/speech"
              sx={{
                mx: 0.5,
                color: isActive('/speech') ? colors.accent3 : colors.white,
                borderBottom: isActive('/speech') ? `2px solid ${colors.accent3}` : 'none',
                borderRadius: 0,
                '&:hover': {
                  color: colors.accent3,
                  background: 'transparent'
                }
              }}
            >
              Speech
            </Button>
            <Button 
              component={Link} 
              to="/qa"
              sx={{
                mx: 0.5,
                color: isActive('/qa') ? colors.accent4 : colors.white,
                borderBottom: isActive('/qa') ? `2px solid ${colors.accent4}` : 'none',
                borderRadius: 0,
                '&:hover': {
                  color: colors.accent4,
                  background: 'transparent'
                }
              }}
            >
              Q&A
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              background: '#0A0A0F',
              borderRight: '1px solid #2A2A35'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Toolbar />

      <Box component="main" sx={{ 
        flexGrow: 1,
        height: 'calc(100vh - 64px)',
        overflow: 'hidden'
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/spam-filter" element={<SpamFilter />} />
          <Route path="/speech" element={<SpeechRecognition />} />
          <Route path="/qa" element={<QA_System />} />
        </Routes>
      </Box>
    </Box>
  );
}

// Main App Component with Router wrapper
function App() {
  return (
    <ThemeProvider theme={createTheme({
      palette: {
        mode: 'dark',
        primary: { main: '#3B82F6' },
        secondary: { main: '#8B5CF6' },
        background: { default: '#0A0A0F', paper: '#12121A' },
        text: { primary: '#FFFFFF', secondary: '#B0B0C0' },
      },
    })}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;