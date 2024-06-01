const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Comment extends Model {}

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    ticketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tickets', key: 'id' }
    },
    comment: {
        type: DataTypes.STRING(250),
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'comment'
})

module.exports = Comment