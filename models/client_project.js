const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Client_Project extends Model {}

Client_Project.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'clients', key: 'id' }
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'projects', key: 'id' }
    },
    since: {
        type: DataTypes.DATE,
        allowNull: false
    },
    to: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    updatedAt: false,
    createdAt: false,
    modelName: 'client_project'
})

module.exports = Client_Project