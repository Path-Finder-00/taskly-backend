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
        type: DataTypes.STRING(80),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(150),
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'project'
})

module.exports = Project