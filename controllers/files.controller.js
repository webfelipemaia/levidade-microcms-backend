const express = require('express');
const router = express.Router();
const Joi = require('joi');
const fs = require('fs');
const validateRequest = require('../middleware/validate-request');
const fileService = require('../services/file.service ');
const singleUploadFileMiddleware = require("../middleware/upload");
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
  
  try {
      await singleUploadFileMiddleware(req, res);

      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
      
      console.log(req.file)
            
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
      
      await fileService.create({ name: filename, path: renamedPath, articleId: 1 });
           
      res.status(200).send({
        message: { 
          uploaded: originalname + "was uploaded the file successfully as " + filename,
          saved: "The file " + filename + "was successfully saved to the database."
        },
      });
      
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file}. ${err}`,
      });
    }
};
  
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