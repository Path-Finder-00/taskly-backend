const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Ticket_History extends Model {}

Ticket_History.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'employee', key: 'id' }
    },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'status', key: 'id' }
    },
    priorityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'priority', key: 'id' }
    },
    ticketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'ticket', key: 'id' }
    },
    date_since: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_to: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    updatedAt: false,
    modelName: 'ticket_history'
})

module.exports = Ticket_History