const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('types', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            type: {
                type: DataTypes.STRING(20),
                allowNull: false
            }
        })
        await queryInterface.createTable('tickets', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING(80),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            project_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'projects', key: 'id' }
            },
            type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'types', key: 'id' }
            },
            created_at: {
                type: DataTypes.DATE
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('types')
        await queryInterface.dropTable('tickets')
    }
}