const util = require("util");
const multer = require("multer");
const path = require('path');
const crypto = require("crypto");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/storage/");
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

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;