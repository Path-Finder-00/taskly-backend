const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('permissions', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false
            }
        })
        await queryInterface.createTable('access_permissions', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            access_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'accesses', key: 'id' }
            },
            permission_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'permissions', key: 'id' }
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('permissions')
        await queryInterface.dropTable('access_permissions')
    }
}