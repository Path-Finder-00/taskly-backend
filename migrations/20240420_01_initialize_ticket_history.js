const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('teams', {
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
            },  
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('teams')
    }
}