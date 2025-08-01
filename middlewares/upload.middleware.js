const util = require("util");
const multer = require("multer");
const fs = require("fs");
const { fromBuffer } = require("file-type");
const path = require("path");
const crypto = require("crypto");
const settingsHelper = require("../helpers/settings.helper");
const {
  UPLOAD_CONTENT_TYPE,
  ALLOWED_MIME_TYPES,
} = require("../helpers/constants.helper");

// Verificar e/ou criar diretórios
function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  }
}

// Validar `contentType` e retornar subdiretório
async function getUploadPath(contentType) {
  const settings = await settingsHelper.loadSettings();

  if (
    !contentType ||
    !Object.values(UPLOAD_CONTENT_TYPE).includes(contentType)
  ) {
    throw new Error("Tipo de conteúdo inválido, ausente ou não permitido");
  }

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
      
      const contentType = `${req.body?.contentType || ""}`.trim().toLowerCase();
      const settings = await settingsHelper.loadSettings();
      const basePath = settings.uploadPathContent[0]?.value;
      
      if (!basePath || typeof basePath !== "string") {
        throw new Error("Caminho de upload inválido nas configurações");
      }

      const subfolder = await getUploadPath(`${contentType}`);

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");

      const uploadPath = path.join(
        __basedir,
        basePath,
        subfolder,
        `${year}_${month}`
      );

      await fs.promises.mkdir(uploadPath, { recursive: true });

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

const uploadFile = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error("Tipo de arquivo não permitido"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: async () => {
      const settings = await settingsHelper.loadSettings();
      const maxFileSize = settings.uploadMaxFileSize.value;
      return parseInt(settings.filesize[maxFileSize].value);
    },
  },
}).fields([
  {
    name: "file",
    maxCount: async () => {
      const settings = await loadSettings();
      return parseInt(settings.uploadLimit.value);
    },
  },
]);

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
