const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Attachment extends Model {}

Attachment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ticketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tickets', key: 'id' }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    name: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'attachment'
})

module.exports = Attachment