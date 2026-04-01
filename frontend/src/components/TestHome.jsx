import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const TestHome = () => {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h2">🏠 HOME PAGE</Typography>
      <Typography variant="h5">If you can see this, routing is working!</Typography>
      <Box sx={{ mt: 4 }}>
        <Typography>Current URL: {window.location.href}</Typography>
      </Box>
    </Paper>
  );
};

export default TestHome;