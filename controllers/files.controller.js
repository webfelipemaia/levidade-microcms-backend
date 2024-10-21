const express = require('express');
const router = express.Router();
const Joi = require('joi');
const fs = require('fs');
const validateRequest = require('../middleware/validate-request');
const fileService = require('../services/file.service ');
const uploadFileMiddleware = require("../middleware/upload");
const multipleUploadFile = require("../middleware/multipleUpload");
const { UPLOAD_PATH } = require('../helpers/constants');

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
    fileService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'File updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    fileService.delete(req.params.id)
        .then(() => res.json({ message: 'File deleted' }))
        .catch(next);
}

 async function upload(req, res) {
  console.log(req.file);
  try {
      await uploadFileMiddleware(req, res);

      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
                  
      const { originalname, filename, path } = req.file
      
      // Recuperar a parte da string a partir de 'storage'
      const storagePath = path.split('storage')[1];
      // Adiciona 'storage' no início para manter a referência completa
      // Output: 'storage/12b3ee2eeba5232ab5dae111d798ab0b.jpeg'
      const fullStoragePath = 'storage' + storagePath;
      // Encontra o índice do último ponto, que indica o início da extensão
      const dotIndex = fullStoragePath.lastIndexOf('.');
      // Retorna a parte da string antes do último ponto
      // Output: 'storage/12b3ee2eeba5232ab5dae111d798ab0b'
      const renamedPath = fullStoragePath.substring(0, dotIndex);
      
      // todo: remover articleId (foi criada uma tabela para associar arquivos a artigos)
      // criar tabela para detalhes de arquivos como imagem, vídeo, etc
      const fileCreated = await fileService.create({ name: filename, path: renamedPath, articleId: 1 });
           
      res.status(200).send({
        message: { 
          uploaded: `${originalname} was uploaded successfully.`,
          saved: "The file " + filename + "was successfully saved to the database.",
          file: {
            originalName: originalname,
            name: filename,
            path: renamedPath
          },
          created: fileCreated
        },
      });
      
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file}. ${err}`,
      });
    }
};

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