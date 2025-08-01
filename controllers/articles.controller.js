const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest.middleware');
const articleService = require('../services/article.service');
const fileService = require('../services/file.service ');
const crypto = require("crypto");
const { pagination } = require("../services/setting.service");

// route functions

exports.getAll = (req, res, next) => {
    articleService.getAll()
        .then(articles => res.json(articles))
        .catch(next);
};

exports.getAllPaginated = async (req, res, next) => {
    try {
        const paginationSettings = await pagination();
        const storedPageOrder =  paginationSettings.order
        const storedPageSize = parseInt(paginationSettings.pageSize);        
        
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || storedPageSize;
        
        const searchQuery = req.query.search || '';        
        const order = req.query.order
            ? JSON.parse(req.query.order)
            : [storedPageOrder];

        const result = await articleService.getPaginatedArticles(page, pageSize, searchQuery, order);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
};


exports.getById = (req, res, next) => {
    articleService.getById(req.params.id)
        .then(article => res.json(article))
        .catch(next);
};

exports.getLastRegister = (req, res, next) => {
    articleService.getLastRegister()
        .then(article => res.json(article))
        .catch(next);
};


exports.create = (req, res, next) => {
    articleService.create(req.body)
        .then(article => {
            if (!article || !article.id) {
                throw new Error('Article creation failed. ID not found.');
            }
            // Adiciona o ID do artigo criado aos parâmetros para o fileService.update
            const updatedParams = { ...req.body, articleId: article.id };
            return fileService.renameAndUpdateFile(req.body.fileId, updatedParams);
        })
        .then(() => res.json({ message: 'Article created with file updated' }))
        .catch(next);
};

exports.createAndReturnId = (req, res, next) => {
    articleService.create(req.body)
        .then(article => res.json({ status: 'success', message: 'Article created', id: article.id }))
        .catch(next);
};

exports.update = (req, res, next) => {
    articleService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Article updated' }))
        .catch(next);;
};

exports._delete = (req, res, next) => {
    articleService.delete(req.params.id)
        .then(() => res.json({ message: 'Article deleted' }))
        .catch(next);
};

// schema functions

exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        subtitle: Joi.string().optional(),
        slug: Joi.string().optional(),
        body: Joi.string().optional(),
        status: Joi.number().required(),
        featured: Joi.boolean().required(),
        categoryId: Joi.number().integer().required(),
        fileId: Joi.number().optional(),
    });
    validateRequest(req, next, schema);
};

exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        subtitle: Joi.string().empty(''),
        slug: Joi.string().empty(''),
        body: Joi.string().empty(''),
        status: Joi.number().required(),
        featured: Joi.boolean().empty(''),
        categoryId: Joi.number().integer().empty(''),
        fileId: Joi.number().optional(),
    });
    validateRequest(req, next, schema);
};