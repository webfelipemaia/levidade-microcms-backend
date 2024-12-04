const express = require('express');
const router = express.Router();
const Joi = require('joi');
const fs = require('fs');
const validateRequest = require('../middleware/validate-request');
const fileService = require('../services/file.service ');
const uploadFileMiddleware = require("../middleware/upload");
//const multipleUploadFile = require("../middleware/multipleUpload");
const { UPLOAD_PATH } = require('../helpers/constants.helper');

// routes

router.post('/upload', upload);
router.get('/all', getFiles);
router.get('/:name', download);
router.get('/', getAll);
router.get('/last', getLastRegister);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    fileService.getAll()
        .then(files => res.json(files))
        .catch(next);
}

function getById(req, res, next) {
    fileService.getById(req.params.id)
        .then(file => res.json(file))
        .catch(next);
}

function getLastRegister(req, res, next) {
    fileService.getLastRegister()
        .then(file => res.json(file))
        .catch(next);
}

function create(req, res, next) {
    fileService.create(req.body)
        .then(() => res.json({ message: 'File created' }))
        .catch(next);
}

function update(req, res, next) {
    fileService.update(req.body.fileId, req.body)
        .then(() => res.json({ message: 'File updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    fileService.delete(req.params.id)
        .then(() => res.json({ message: 'File deleted' }))
        .catch(next);
}

async function upload(req, res) {
  try {
    await uploadFileMiddleware(req, res);

    // Verifica se existem arquivos no req.files
    if (!req.files || !req.files.file || req.files.file.length === 0) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // Obtém o primeiro arquivo do campo "file"
    const uploadedFile = req.files.file[0];
    const { originalname, filename, path: filePath } = uploadedFile;

    console.log("Uploaded file:", uploadedFile);

    // Recuperar a parte da string a partir de 'storage'
    const storagePath = filePath.split('storage')[1];
    const fullStoragePath = 'storage' + storagePath;

    // Renomear o caminho removendo a extensão
    const dotIndex = fullStoragePath.lastIndexOf('.');
    const renamedPath = fullStoragePath.substring(0, dotIndex);

    // Salvar o arquivo no banco de dados
    const fileCreated = await fileService.create({
      name: filename,
      path: renamedPath,
      type: uploadedFile.mimetype,
    });

    res.status(200).send({
      message: {
        uploaded: `${originalname} was uploaded successfully.`,
        saved: `The file ${filename} was successfully saved to the database.`,
        file: {
          originalName: originalname,
          name: filename,
          path: renamedPath,
        },
        created: fileCreated,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: `Could not upload the file. ${err.message}`,
    });
  }
};

// Primeira tentativa com múltiplo upload. 
// Achou-se por bem efetuar apenas um upload por vez até o momento.

/* async function upload(req, res) {
  console.log(req.body)
  try {
    await multipleUploadFile(req, res);
    
    if (!req.body.files || !req.body.files['files'] || req.body.files['files'].length === 0) {
      return res.status(400).send({ message: "Please upload at least one file!" });
    }

    const uploadedFiles = [];

    for (const file of req.body.files['files']) {
      const { originalname, filename, path } = file;

      // Retrieve part of string from 'storage'
      const storagePath = path.split('storage')[1];
      const fullStoragePath = 'storage' + storagePath;

      // Find the index of the last point to get the path without extension
      const dotIndex = fullStoragePath.lastIndexOf('.');
      const renamedPath = fullStoragePath.substring(0, dotIndex);

      // if it is associated with an article or content
      if(req.body.articleId) {
        await fileService.create({ 
          name: filename, 
          path: renamedPath,
          articleId: Number(req.body.articleId),
        });
      }

      // Adds the processed file to the list of uploaded files
      uploadedFiles.push({
        originalname,
        filename,
        path: renamedPath,
        articleId: Number(req.body.articleId)
      });
    }

    res.status(200).send({
      message: `${uploadedFiles.length} files were uploaded and saved successfully.`,
      files: uploadedFiles
    });

  } catch (err) {
    res.status(500).send({
      message: `Could not upload the files. ${err}`,
    });
  }
}
 */
  
async function getFiles(req, res, next) {
    const directoryPath = __basedir + UPLOAD_PATH.ROOT;

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }
  
      let fileInfos = [];
  
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: directoryPath + file,
        });
      });
  
      res.status(200).send(fileInfos);
    });
  }
  
function download(req, res, next) {
    const fileName = req.params.name;
    const directoryPath = __basedir + UPLOAD_PATH.ROOT;

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
        res.status(500).send({
            message: "Could not download the file. " + err,
        });
        }
    });
  };

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        path: Joi.string().optional(),
        id: Joi.number().integer().optional()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        path: Joi.string().empty(''),
        categoryId: Joi.number().integer().empty('')
    });
    validateRequest(req, next, schema);
}