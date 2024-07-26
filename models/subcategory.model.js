const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subcategory = sequelize.define('Subcategory', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Category',
            key: 'id'
        },
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        //allowNull: false,
        //defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        //allowNull: false,
        //defaultValue: DataTypes.NOW
    }
});

Subcategory.associate = (models) => {
    Subcategory.belongsTo(models.Category, { foreignKey: 'categoryId' });
};

module.exports = Subcategory;
