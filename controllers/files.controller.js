const Joi = require('joi');
const fs = require('fs');
const validateRequest = require('../middlewares/validateRequest.middleware');
const fileService = require('../services/file.service ');
const uploadFile = require("../middlewares/upload.middleware");
const { uploadPath } = require("../services/setting.service");
const validateFile = require("../middlewares/file.middleware");
const logger = require("../config/logger");


/**
 * Fetch all files.
 *
 * @route GET /files
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<Object[]>} JSON array of all files.
 */
exports.getAll = (req, res, next) => {
    fileService.getAll()
        .then(files => res.json(files))
        .catch(next);
};

/**
 * Fetch a single file by ID.
 *
 * @route GET /files/:id
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object of the requested file.
 */
exports.getById = (req, res, next) => {
    fileService.getById(req.params.id)
        .then(file => res.json(file))
        .catch(next);
};

/**
 * Fetch the last registered file.
 *
 * @route GET /files/last
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON object of the last created file.
 */
exports.getLastRegister = (req, res, next) => {
    fileService.getLastRegister()
        .then(file => res.json(file))
        .catch(next);
};

/**
 * Create a new file record in the database.
 *
 * @route POST /files
 * @param {import('express').Request} req - Expects file data in req.body.
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON message indicating creation success.
 */
exports.create = (req, res, next) => {
    fileService.create(req.body)
        .then(() => res.json({ message: 'File created' }))
        .catch(next);
};

/**
 * Update an existing file record by fileId.
 *
 * @route PUT /files
 * @param {import('express').Request} req - Expects fileId and updated data in req.body.
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON message indicating update success.
 */
exports.update = (req, res, next) => {
    fileService.update(req.body.fileId, req.body)
        .then(() => res.json({ message: 'File updated' }))
        .catch(next);
};

/**
 * Delete a file record by ID.
 *
 * @route DELETE /files/:id
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON message indicating deletion success.
 */
exports._delete = (req, res, next) => {
    fileService.delete(req.params.id)
        .then(() => res.json({ message: 'File deleted' }))
        .catch(next);
};

/**
 * Handles file upload, validation, renaming, and saving file record to DB.
 *
 * @route POST /files/upload
 * @param {import('express').Request} req - Expects multipart/form-data with field "file".
 * @param {import('express').Response} res
 * @returns {Promise<Object>} JSON with upload result, file info, and DB creation confirmation.
 */
exports.upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    await validateFile(req, res, () => {});

    if (!req.files?.file || req.files.file.length === 0) {
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
    logger.error(error);
    res.status(500).send({
      message: `Could not upload the file. ${error.message}`,
    });
  }
};

/**
 * List all files in the upload directory.
 *
 * @route GET /files/list
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.getFiles = async (req, res, next) => {
    const uploadPaths = await uploadPath();
    const directoryPath = __basedir + uploadPaths.uploadPathRoot;

    fs.readdir(directoryPath, function(err, files) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }
  
      const fileInfos = files.map(file => ({
          name: file,
          url: directoryPath + file
      }));
  
      res.status(200).send(fileInfos);
    });
};

/**
 * Download a file by name from the upload directory.
 *
 * @route GET /files/download/:name
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.download = async (req, res, next) => {
    const fileName = req.params.name;
    const uploadPaths = await uploadPath();
    const directoryPath = __basedir + uploadPaths.uploadPathRoot;

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

/**
 * Validation schema for creating a file.
 */
exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        path: Joi.string().optional(),
        id: Joi.number().integer().optional()
    });
    validateRequest(req, next, schema);
};

/**
 * Validation schema for updating a file.
 */
exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        path: Joi.string().empty(''),
        categoryId: Joi.number().integer().empty('')
    });
    validateRequest(req, next, schema);
};