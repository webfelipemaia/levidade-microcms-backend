const util = require("util");
const multer = require("multer");
const path = require('path');
const crypto = require("crypto");
const { FILESIZES, UPLOAD_PATH } = require('../helpers/constants');

// definir como parâmetro configurável
const maxSize = FILESIZES["2 MB"];


// a fazer: no middleware upload, modificar para aceitar parâmtetro
// para tipo de upload e armazenar os arquivos em seus respectivos diretórios

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + UPLOAD_PATH.ROOT);
  },
  filename: (req, file, cb) => {
    console.log("Original file name: " + file.originalname);
    const ext = path.extname(file.originalname);
    const uniqueName = crypto.randomBytes(16).toString('hex') + ext;
    console.log("Generated file name: " + uniqueName);
    //cb(null, file.originalname);
    cb(null, uniqueName);
  },
});

// upload simples
let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

// upload múltiplo


// export
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;