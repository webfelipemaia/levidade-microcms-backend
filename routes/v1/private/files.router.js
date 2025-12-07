const express = require('express');
const privateFileRouterV1 = express.Router();
const authenticate = require("../../../middlewares/auth.middleware");

const {
    upload, 
    getFiles, 
    download, 
    getAll, 
    getLastRegister,
    create,
    update,
    _delete,
    getFileUrl,
    getFileById,
    getByStorageType,
    getProfileImages,
} = require('../../../controllers/files.controller');

const {
    createSchema,
    updateSchema,
} = require('../../../controllers/files.controller');

privateFileRouterV1.post('/upload', authenticate, upload);
privateFileRouterV1.get('/all', authenticate, getFiles);
privateFileRouterV1.get('/:id', authenticate, getFileById);
privateFileRouterV1.get('/:id/url', authenticate, getFileUrl);
privateFileRouterV1.get('/:name', authenticate, download);
privateFileRouterV1.get('/', authenticate, getAll);
privateFileRouterV1.get('/last', authenticate, getLastRegister);
privateFileRouterV1.post('/', authenticate, createSchema, create);
privateFileRouterV1.put('/:id', authenticate, updateSchema, update);
privateFileRouterV1.delete('/:id', authenticate, _delete);
privateFileRouterV1.get('/storage/:type', authenticate, getByStorageType);
privateFileRouterV1.get('/profile-images', authenticate, getProfileImages);

module.exports = privateFileRouterV1;
