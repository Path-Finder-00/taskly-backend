const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Priority extends Model {}

Priority.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    priority: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'priority'
})

module.exports = Priority