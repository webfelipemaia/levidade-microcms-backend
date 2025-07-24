// middlewares/validateFile.js
const fs = require('fs');
const { fileTypeFromFile } = require('file-type');

const validateFile = async (req, res, next) => {
  try {
    
    const file = req.files?.file?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No file found for validation.' });
    }

    const filePath = file.path;
    const fileType = await fileTypeFromFile(filePath);

    if (!fileType) {
      return res.status(400).json({ message: 'Unable to determine file type.' });
    }

    if (fileType.mime !== file.mimetype) {
      return res.status(400).json({
        message: `File type mismatch. Detected: ${fileType.mime}, Declared: ${file.mimetype}`,
      });
    }

    next();
  } catch (error) {
    console.error('File validation error:', error);
    return res.status(500).json({ message: 'Error validating file type.' });
  }
};

module.exports = validateFile;
