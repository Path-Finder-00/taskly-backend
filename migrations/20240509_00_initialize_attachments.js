const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('attachments', {
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
            },
            name: {
                type: DataTypes.STRING(120),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(120),
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE
            },
            updated_at: {
                type: DataTypes.DATE
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('attachments')
    }
}