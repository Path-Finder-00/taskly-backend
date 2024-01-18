const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Project extends Model {}

Project.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'project'
})

module.exports = Project