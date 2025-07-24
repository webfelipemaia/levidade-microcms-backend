const util = require("util");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const { FILESIZES, UPLOAD_PATH, UPLOAD_CONTENT_TYPE } = require('../helpers/constants.helper');

const maxSize = FILESIZES["2 MB"];
const uploadLimit = 3;
const articleDir = UPLOAD_CONTENT_TYPE.ARTICLE;
const pageDir = UPLOAD_CONTENT_TYPE.PAGE;
const productDir = UPLOAD_CONTENT_TYPE.PRODUCT;

// Function to check or create directories
function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: false });
    console.log(`Directory created: ${dirPath}`);
  }
}

let storage = multer.diskStorage({

  destination: (req, file, cb) => {
    
    // base path of the "article" folder
    let uploadPath = __basedir + UPLOAD_PATH.CONTENT;

    if (req.body.articleId) {
      
      const articleId = req.body.articleId;
      uploadPath = __basedir + UPLOAD_PATH.CONTENT + articleDir;
      
      // folder /content/content_type/{articleId}
      uploadPath = path.join(uploadPath, articleId);
      
      // Check if subfolder "{articleId}" exists, otherwise create
      ensureDirectoryExistence(uploadPath);

    } else if(req.body.pageId) {

      const pageId = req.body.pageId;
      uploadPath = __basedir + UPLOAD_PATH.CONTENT + pageDir;
      
      // folder /content/content_type/{pageId}
      uploadPath = path.join(uploadPath, pageId);
      
      // Check if subfolder "{pageId}" exists, otherwise create
      ensureDirectoryExistence(uploadPath);

    } else if(req.body.productId) {
      
      const productId = req.body.productId;
      uploadPath = __basedir + UPLOAD_PATH.CONTENT + productDir;
      
      // folder /content/content_type/{productId}
      uploadPath = path.join(uploadPath, productId);
      
      // Check if the subfolder "{productId}" exists, otherwise create it
      ensureDirectoryExistence(uploadPath);

    } else {
      console.log('Upload file to default content folder.')
    }
    // Defines the upload directory as the final folder
          const articleId = req.body.articleId;
      uploadPath = __basedir + UPLOAD_PATH.CONTENT + articleDir;
      
      // folder /content/content_type/{articleId}
      uploadPath = path.join(uploadPath, articleId);
      
      // Check if subfolder "{articleId}" exists, otherwise create
      ensureDirectoryExistence(uploadPath);
    cb(null, uploadPath);
    
  },
  
  filename: (req, file, cb) => {
    
    const ext = path.extname(file.originalname);
    const uniqueName = crypto.randomBytes(16).toString('hex') + ext;
    console.log("Original file name: " + file.originalname);
    console.log("extension file: " + ext);
    console.log("Generated file name: " + uniqueName);
    //cb(null, file.originalname);
    cb(null, uniqueName);
  },

});

let multipleUploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize }, // Defines the file size limit
}).fields([
  { name: "files", maxCount: uploadLimit }, // File Upload Field
]);


/* let multipleUploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize }, // Defines the file size limit
}).fields([
  { name: "articleId", maxCount: 1 }, // The `articleId` field
  { name: "files", maxCount: uploadLimit }, // File Upload Field
]); */

// export
let multipleUploadFileMiddleware = util.promisify(multipleUploadFile);
module.exports = multipleUploadFileMiddleware;