const Joi = require('joi');
const fs = require('fs');
const validateRequest = require('../middlewares/validateRequest.middleware');
const fileService = require('../services/file.service ');
const uploadFile = require("../middlewares/upload.middleware");
const { uploadPath } = require("../services/setting.service");
const validateFile = require("../middlewares/file.middleware");

// route functions

exports.getAll = (req, res, next) => {
    fileService.getAll()
        .then(files => res.json(files))
        .catch(next);
}

exports.getById = (req, res, next) => {
    fileService.getById(req.params.id)
        .then(file => res.json(file))
        .catch(next);
};

exports.getLastRegister = (req, res, next) => {
    fileService.getLastRegister()
        .then(file => res.json(file))
        .catch(next);
};

exports.create = (req, res, next) => {
    fileService.create(req.body)
        .then(() => res.json({ message: 'File created' }))
        .catch(next);
}

exports.update = (req, res, next) => {
    fileService.update(req.body.fileId, req.body)
        .then(() => res.json({ message: 'File updated' }))
        .catch(next);
}

exports._delete = (req, res, next) => {
    fileService.delete(req.params.id)
        .then(() => res.json({ message: 'File deleted' }))
        .catch(next);
}

exports.upload = async (req, res) => {
  try {

    await uploadFile(req, res);

    await validateFile(req, res, () => {});

    if (!req.files || !req.files.file || req.files.file.length === 0) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    const uploadedFile = req.files.file[0];
    const { originalname, filename, path: filePath } = uploadedFile;
    const storagePath = filePath.split('storage')[1];
    const fullStoragePath = 'storage' + storagePath;
    const dotIndex = fullStoragePath.lastIndexOf('.');
    const renamedPath = fullStoragePath.substring(0, dotIndex);

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
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: `Could not upload the file. ${error.message}`,
    });
  }
};
  
exports.getFiles = async (req, res, next) => {

    const uploadPaths = await uploadPath();
    const directoryPath = __basedir + uploadPaths.uploadPathRoot;

    fs.readdir(directoryPath, function(err, files) {
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
  
exports.download = async (req, res, next) => {
    const fileName = req.params.name;
    const uploadPaths = await uploadPath()
    const directoryPath = __basedir + uploadPaths.uploadPathRoot;

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
        res.status(500).send({
            message: "Could not download the file. " + err,
        });
        }
    });
  };

// schema functions

exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        path: Joi.string().optional(),
        id: Joi.number().integer().optional()
    });
    validateRequest(req, next, schema);
};

exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        path: Joi.string().empty(''),
        categoryId: Joi.number().integer().empty('')
    });
    validateRequest(req, next, schema);
};