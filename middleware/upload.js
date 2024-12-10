const util = require("util");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const settingsHelper = require('../helpers/settings.helper');

// Função para verificar e/ou criar diretórios
function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  }
}

// Função para validar `contentType` e retornar subdiretório
 async function getUploadPath(contentType) {
    const settings = await settingsHelper.loadSettings();
  
    if (!settings.uploadContentType) {
      throw new Error("Configuração uploadContentType não encontrada no banco.");
    }
  
    const contentTypePaths = settings.uploadContentType;
  
    let matchedContentType;
  
    if (Array.isArray(contentTypePaths)) {
      matchedContentType = contentTypePaths.find(
        (item) => item.value === contentType
      );
    } else if (typeof contentTypePaths === "object") {
      matchedContentType = Object.values(contentTypePaths).find(
        (item) => item.value === contentType
      );
    } else {
      throw new Error("uploadContentType deve ser um array ou objeto.");
    }
  
    if (matchedContentType) {
      return matchedContentType.value;
    }
  
    throw new Error("contentType inválido ou não encontrado.");
  }
  

// Configuração do armazenamento com `multer`
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { contentType } = req.body;

      const settings = await settingsHelper.loadSettings();
      const subfolder = await getUploadPath(`${contentType}`);      
      
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      
      const uploadPath = path.join(
        __basedir,
        String(settings.uploadPathContent[0].value),
        subfolder,
        `${year}_${month}`
      );

      ensureDirectoryExistence(uploadPath);

      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    
    const ext = path.extname(file.originalname);
    const uniqueName = crypto.randomBytes(16).toString("hex") + ext;

    console.log("Upload file...");
    console.log(`Original file name: ${file.originalname}`);
    console.log(`File extension: ${ext}`);
    console.log(`Generated file name: ${uniqueName}`);
    
    cb(null, uniqueName);
  },
});

// Configuração do middleware de upload
const uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: async () => {
      const settings = await loadSettings();
      const maxFileSize = settings.uploadMaxFileSize.value;
      // Obtém o tamanho máximo do cache
      return parseInt(settings.filesize[maxFileSize].value);
    },
  },
}).fields([
  { name: "file", maxCount: async () => {
      const settings = await loadSettings();
      return parseInt(settings.uploadLimit.value); // Define o limite do cache
    },
  },
]);

// Exporta o middleware de upload com suporte a Promises
const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
