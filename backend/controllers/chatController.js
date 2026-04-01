const { spawn } = require('child_process');
const path = require('path');
const logger = require('../utils/logger');

exports.processMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    logger.info(`Processing chat message: "${message.substring(0, 50)}..."`);

    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../../ai-models/scripts/chatbot.py'),
      message
    ]);

    let result = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      logger.error(`Python error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        logger.info('Chat response generated successfully');
        res.json({ 
          reply: result.trim() || "I'm not sure how to respond to that.",
          timestamp: new Date().toISOString()
        });
      } else {
        logger.error(`Python process exited with code ${code}`);
        res.status(500).json({ 
          error: 'AI processing failed',
          details: errorOutput || 'Unknown error'
        });
      }
    });

    pythonProcess.on('error', (err) => {
      logger.error(`Failed to start Python process: ${err}`);
      res.status(500).json({ error: 'Failed to start AI service' });
    });

  } catch (error) {
    logger.error(`Chat controller error: ${error.message}`);
    next(error);
  }
};