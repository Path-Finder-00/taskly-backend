const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('user_tickets', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            ticket_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'tickets', key: 'id' }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' }
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('user_tickets')
    }
}