import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              AI Applications Platform
            </Typography>
            <Typography variant="body2">
              Four powerful AI applications in one place.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>Home</Link>
              <Link href="/chatbot" color="inherit" display="block" sx={{ mb: 1 }}>ChatBot</Link>
              <Link href="/spam-filter" color="inherit" display="block" sx={{ mb: 1 }}>Spam Filter</Link>
              <Link href="/speech" color="inherit" display="block" sx={{ mb: 1 }}>Speech Recognition</Link>
              <Link href="/qa" color="inherit" display="block">Q&A System</Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <IconButton color="inherit" href="https://github.com" target="_blank">
                <GitHubIcon />
              </IconButton>
              <IconButton color="inherit" href="https://linkedin.com" target="_blank">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" href="https://twitter.com" target="_blank">
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          © {new Date().getFullYear()} AI Applications Platform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;