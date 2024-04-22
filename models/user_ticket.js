const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User_Ticket extends Model {}

User_Ticket.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'ticket', key: 'id' }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user_ticket'
})

module.exports = User_Ticket