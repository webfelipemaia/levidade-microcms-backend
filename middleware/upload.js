const util = require("util");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { FILESIZES, UPLOAD_PATH, UPLOAD_CONTENT_TYPE } = require("../helpers/constants.helper");

// Configuração do tamanho máximo de upload e número de arquivos permitidos
const maxSize = FILESIZES["2 MB"];
const uploadLimit = 3;

// Função para verificar e/ou criar diretórios
function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  }
}

// Função para validar `contentType` e retornar subdiretório
function getUploadPath(contentType) {
  switch (contentType) {
    case UPLOAD_CONTENT_TYPE.ARTICLE:
      return UPLOAD_CONTENT_TYPE.ARTICLE;
    case UPLOAD_CONTENT_TYPE.PAGE:
      return UPLOAD_CONTENT_TYPE.PAGE;
    case UPLOAD_CONTENT_TYPE.PRODUCT:
      return UPLOAD_CONTENT_TYPE.PRODUCT;
    case UPLOAD_CONTENT_TYPE.PROFILE:
      return UPLOAD_CONTENT_TYPE.PROFILE;
    default:
      console.error("Invalid or missing contentType");
      throw new Error("Invalid or missing contentType");
  }
}

// Configuração do armazenamento com `multer`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const { contentType } = req.body;

      // Chama a função para obter o subdiretório
      const subfolder = getUploadPath(contentType);

      // Obtém o ano e o mês atuais
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      // Garante o zero à esquerda
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");

      // Define o caminho de upload com ano e mês
      const uploadPath = path.join(
        __basedir,
        UPLOAD_PATH.CONTENT,
        subfolder,
        `${year}_${month}`
      );

      // Garante que o diretório existe
      ensureDirectoryExistence(uploadPath);

      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },

  filename: (req, file, cb) => {

    // Obtém a extensão do arquivo e gera um nome único
    const ext = path.extname(file.originalname);
    const uniqueName = crypto.randomBytes(16).toString("hex") + ext;

    console.log(`Original file name: ${file.originalname}`);
    console.log(`File extension: ${ext}`);
    console.log(`Generated file name: ${uniqueName}`);
    
    // Define o nome do arquivo
    cb(null, uniqueName);
  },
});

// Configuração do middleware de upload
const uploadFile = multer({
  storage: storage,
  // Define o tamanho máximo do arquivo
  limits: { fileSize: maxSize },
}).fields([
  // Define o campo de upload e limite
  { name: "file", maxCount: uploadLimit },
]);

// Exporta o middleware de upload com suporte a Promises
const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
