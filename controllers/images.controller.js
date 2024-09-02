const express = require('express');
const router = express.Router();
const Joi = require('joi');
const fs = require('fs');
const validateRequest = require('../middleware/validate-request');
const imageService = require('../services/image.service ');
const uploadFile = require("../middleware/upload");
const { UPLOAD_PATH } = require('../helpers/constants');

// routes

router.post('/upload', upload);
router.get('/all', getFiles);
router.get('/', getAll);
router.get('/last', getLastRegister);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    imageService.getAll()
        .then(files => res.json(files))
        .catch(next);
}

function getById(req, res, next) {
    imageService.getById(req.params.id)
        .then(file => res.json(file))
        .catch(next);
}

function getLastRegister(req, res, next) {
    imageService.getLastRegister()
        .then(file => res.json(file))
        .catch(next);
}

function create(req, res, next) {
    imageService.create(req.body)
        .then(() => res.json({ message: 'Image created' }))
        .catch(next);
}

function update(req, res, next) {
    imageService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Image updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    imageService.delete(req.params.id)
        .then(() => res.json({ message: 'Image deleted' }))
        .catch(next);
}

async function upload(req, res) {
  
  try {
      // a fazer: no middleware upload, modificar para aceitar parâmtetro
      // para tipo de upload e armazenar os arquivos em seus respectivos diretórios
      await uploadFile(req, res);

      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
      
      console.log(req.file)
            
      const { originalname, filename, path } = req.file
      
      const storagePath = path.split('storage')[1];
      const fullStoragePath = 'storage' + storagePath;
      const dotIndex = fullStoragePath.lastIndexOf('.');
      const renamedPath = fullStoragePath.substring(0, dotIndex);
      
      await imageService.create({ name: filename, path: renamedPath, type: 'avatar', userId: 1 });
           
      res.status(200).send({
        message: { 
          uploaded: originalname + "was uploaded the file successfully as " + filename,
          saved: "The file " + filename + "was successfully saved to the database."
        },
      });
      
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file.filename}. ${err}`,
      });
    }
};
  
async function getFiles(req, res, next) {
    const directoryPath = __basedir + UPLOAD_PATH.PROFILE;

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