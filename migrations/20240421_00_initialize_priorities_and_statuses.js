const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('statuses', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            status: {
                type: DataTypes.STRING(20),
                allowNull: false
            }
        })
        await queryInterface.createTable('priorities', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            priority: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
        })
        await queryInterface.addColumn('ticket_histories', 'status_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'statuses', key: 'id' }
        })
        await queryInterface.addColumn('ticket_histories', 'priority_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'priorities', key: 'id' }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('statuses')
        await queryInterface.dropTable('priorities')
    }
}