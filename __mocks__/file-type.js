// Mock completo do módulo file-type
module.exports = {
    fileTypeFromFile: jest.fn().mockImplementation(async (filePath) => {
      // Simula a detecção de tipos de arquivo baseado na extensão
      const ext = filePath.split('.').pop().toLowerCase();
      
      // Mapeamento de extensões para tipos MIME
      const typeMap = {
        png: { ext: 'png', mime: 'image/png' },
        jpg: { ext: 'jpg', mime: 'image/jpeg' },
        jpeg: { ext: 'jpeg', mime: 'image/jpeg' },
        pdf: { ext: 'pdf', mime: 'application/pdf' },
        gif: { ext: 'gif', mime: 'image/gif' }
      };
  
      // Retorna o tipo correspondente ou undefined para tipos desconhecidos
      return typeMap[ext] || null;
    }),
    
    // Você pode adicionar outras funções do file-type se necessário
    fileTypeFromBuffer: jest.fn().mockResolvedValue(null)
  };