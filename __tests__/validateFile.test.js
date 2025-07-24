const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../server');
const validateFile = require('../middleware/file.middleware');
const { createMockFiles, cleanupMockFiles } = require('./test-utils/file-util');

jest.mock('file-type');

describe('validateFile Middleware', () => {
  const testUploadDir = path.join(__dirname, '..', '..', 'uploads');
  let mockFiles;

  beforeAll(() => {
    if (!fs.existsSync(testUploadDir)) {
      fs.mkdirSync(testUploadDir, { recursive: true });
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockFiles = createMockFiles(testUploadDir);
  });

  afterEach(() => {
    cleanupMockFiles(mockFiles);
  });

  afterAll(() => {
    if (fs.existsSync(testUploadDir)) {
      fs.rmSync(testUploadDir, { recursive: true, force: true });
    }
  });

  test('should pass validation for matching file type and magic number', async () => {
    require('file-type').fileTypeFromFile.mockResolvedValue({
      mime: 'image/png',
      ext: 'png'
    });

    const req = {
      files: {
        file: [{
          path: mockFiles.validPng,
          mimetype: 'image/png'
        }]
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await validateFile(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should reject when magic number does not match declared MIME type', async () => {
    require('file-type').fileTypeFromFile.mockResolvedValue({
      mime: 'application/pdf',
      ext: 'pdf'
    });

    const req = {
      files: {
        file: [{
          path: mockFiles.fakePng,
          mimetype: 'image/png'
        }]
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await validateFile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'File type mismatch. Detected: application/pdf, Declared: image/png'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject when file type cannot be determined', async () => {
    require('file-type').fileTypeFromFile.mockResolvedValue(null);

    const req = {
      files: {
        file: [{
          path: mockFiles.invalidFile,
          mimetype: 'application/octet-stream'
        }]
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await validateFile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unable to determine file type.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return error when no file is provided', async () => {
    const req = {
      files: {}
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await validateFile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No file found for validation.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle file system errors gracefully', async () => {
    require('file-type').fileTypeFromFile.mockRejectedValue(
      new Error('File read error')
    );

    const req = {
      files: {
        file: [{
          path: '/nonexistent/path/to/file',
          mimetype: 'image/png'
        }]
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await validateFile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error validating file type.'
    });
    expect(next).not.toHaveBeenCalled();
  });
});