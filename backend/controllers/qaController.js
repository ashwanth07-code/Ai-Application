const { spawn } = require('child_process');
const path = require('path');
const logger = require('../utils/logger');

exports.answerQuestion = async (req, res, next) => {
  try {
    const { question, context } = req.body;
    
    if (!question || !context) {
      return res.status(400).json({ error: 'Question and context are required' });
    }

    logger.info(`Processing QA request: "${question.substring(0, 50)}..."`);

    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../../ai-models/scripts/qa_system.py'),
      JSON.stringify({ question, context })
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
          logger.info(`QA completed: confidence=${parsed.confidence}`);
          res.json(parsed);
        } catch (parseError) {
          logger.error(`Failed to parse Python output: ${parseError}`);
          res.status(500).json({ error: 'Invalid response from AI service' });
        }
      } else {
        logger.error(`Python process exited with code ${code}`);
        res.status(500).json({ 
          success: false,
          error: 'QA processing failed',
          details: errorOutput || 'Unknown error'
        });
      }
    });

    pythonProcess.on('error', (err) => {
      logger.error(`Failed to start Python process: ${err}`);
      res.status(500).json({ error: 'Failed to start AI service' });
    });

  } catch (error) {
    logger.error(`QA controller error: ${error.message}`);
    next(error);
  }
};