const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Technology extends Model {}

Technology.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    technology: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'technology'
})

module.exports = Technology