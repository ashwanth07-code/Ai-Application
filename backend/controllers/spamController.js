const { spawn } = require('child_process');
const path = require('path');
const logger = require('../utils/logger');

exports.checkSpam = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email content is required' });
    }

    logger.info('Processing spam check request');

    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../../ai-models/scripts/spam_filter.py'),
      email
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
        try {
          const parsed = JSON.parse(result);
          logger.info(`Spam check completed: isSpam=${parsed.isSpam}`);
          res.json(parsed);
        } catch (parseError) {
          logger.error(`Failed to parse Python output: ${parseError}`);
          res.status(500).json({ error: 'Invalid response from AI service' });
        }
      } else {
        logger.error(`Python process exited with code ${code}`);
        res.status(500).json({ 
          error: 'Spam detection failed',
          details: errorOutput || 'Unknown error'
        });
      }
    });

    pythonProcess.on('error', (err) => {
      logger.error(`Failed to start Python process: ${err}`);
      res.status(500).json({ error: 'Failed to start AI service' });
    });

  } catch (error) {
    logger.error(`Spam controller error: ${error.message}`);
    next(error);
  }
};