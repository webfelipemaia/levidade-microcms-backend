module.exports = {
    fileTypeFromFile: jest.fn().mockResolvedValue({
      mime: 'image/png',
      ext: 'png'
    })
  };