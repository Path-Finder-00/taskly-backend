const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Ticket extends Model {}

Ticket.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'projects', key: 'id' }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    updatedAt: false,
    modelName: 'ticket'
})

module.exports = Ticket