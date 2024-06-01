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
        type: DataTypes.STRING(80),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'projects', key: 'id' }
    },
    typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'types', key: 'id' }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    updatedAt: false,
    modelName: 'ticket'
})

module.exports = Ticket