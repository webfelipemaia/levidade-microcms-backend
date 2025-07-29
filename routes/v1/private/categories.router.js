const express = require('express');
const privateCategoryRouterV1 = express.Router();
const authenticate = require("../../../middlewares/auth.middleware");

const {
    getAllCategories,
    getCategoryById,
    createCategory,
    createCategoryWithSubcategories,
    updateCategory,
    deleteCategory,
} = require('../../../controllers/categories.controller');
const {
    createSchema,
    createWithSubcategoriesSchema,
    updateSchema
} = require('../../../controllers/categories.controller');

privateCategoryRouterV1.get('/', authenticate, getAllCategories);
privateCategoryRouterV1.get('/:id', authenticate, getCategoryById);
privateCategoryRouterV1.post('/', authenticate, createSchema, createCategory);
privateCategoryRouterV1.post('/with-subcategories', authenticate, createWithSubcategoriesSchema, createCategoryWithSubcategories);
privateCategoryRouterV1.patch('/:id', authenticate, updateSchema, updateCategory);
privateCategoryRouterV1.delete('/:id', authenticate, deleteCategory);

module.exports = privateCategoryRouterV1;