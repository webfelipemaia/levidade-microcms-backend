// test-utils/file-utils.js
const fs = require('fs');
const path = require('path');

/**
 * Cria arquivos mockados para testes
 */
function createMockFiles(baseDir) {
  const files = {
    validPng: path.join(baseDir, 'valid.png'),
    fakePng: path.join(baseDir, 'fake.png'),
    validPdf: path.join(baseDir, 'valid.pdf'),
    invalidFile: path.join(baseDir, 'invalid.bin')
  };

  // Criar arquivo PNG válido (com header PNG)
  fs.writeFileSync(files.validPng, Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));

  // Criar arquivo com extensão PNG mas conteúdo inválido
  fs.writeFileSync(files.fakePng, 'NOT A REAL PNG FILE');

  // Criar PDF válido (com header PDF)
  fs.writeFileSync(files.validPdf, Buffer.from([0x25, 0x50, 0x44, 0x46]));

  // Criar arquivo inválido sem magic number reconhecível
  fs.writeFileSync(files.invalidFile, Buffer.from([0x00, 0x01, 0x02, 0x03]));

  return files;
}

/**
 * Limpa arquivos mockados após os testes
 */
function cleanupMockFiles(files) {
  Object.values(files).forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`Error cleaning up ${filePath}:`, err);
    }
  });
}

module.exports = {
  createMockFiles,
  cleanupMockFiles
};