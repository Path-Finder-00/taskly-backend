const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('client_projects', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            client_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'clients', key: 'id' }
            },
            project_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'projects', key: 'id' }
            },
            since: {
                type: DataTypes.DATE,
                allowNull: false
            },
            to: {
                type: DataTypes.DATE
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('client_projects')
    }
}