exports.validateChatRequest = (req, res, next) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  if (typeof message !== 'string') {
    return res.status(400).json({ error: 'Message must be a string' });
  }
  
  if (message.length > 5000) {
    return res.status(400).json({ error: 'Message too long (max 5000 characters)' });
  }
  
  next();
};

exports.validateSpamRequest = (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email content is required' });
  }
  
  if (typeof email !== 'string') {
    return res.status(400).json({ error: 'Email content must be a string' });
  }
  
  if (email.length > 50000) {
    return res.status(400).json({ error: 'Email content too long (max 50000 characters)' });
  }
  
  next();
};

exports.validateQARequest = (req, res, next) => {
  const { question, context } = req.body;
  
  if (!question || !context) {
    return res.status(400).json({ error: 'Question and context are required' });
  }
  
  if (typeof question !== 'string' || typeof context !== 'string') {
    return res.status(400).json({ error: 'Question and context must be strings' });
  }
  
  if (question.length > 1000) {
    return res.status(400).json({ error: 'Question too long (max 1000 characters)' });
  }
  
  if (context.length > 50000) {
    return res.status(400).json({ error: 'Context too long (max 50000 characters)' });
  }
  
  next();
};