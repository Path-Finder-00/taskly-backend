const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('ticket_histories', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            employee_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'employees', key: 'id' }
            },
            ticket_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'tickets', key: 'id' }
            },
            since: {
                type: DataTypes.DATE,
                allowNull: true
            },
            to: {
                type: DataTypes.DATE,
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE
            },
            updated_at : {
                type: DataTypes.DATE
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('ticket_histories')
    }
}