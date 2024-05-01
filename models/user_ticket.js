const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User_Ticket extends Model {}

User_Ticket.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ticketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'ticket', key: 'id' }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user_ticket'
})

module.exports = User_Ticket