const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const speechController = require('../controllers/speechController');

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname) || '.wav';
    cb(null, `${uniqueId}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/webm', 'audio/ogg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/', upload.single('audio'), speechController.transcribeAudio);

module.exports = router;