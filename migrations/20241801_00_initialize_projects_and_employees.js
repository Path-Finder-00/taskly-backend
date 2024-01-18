const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('projects', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        })
        await queryInterface.createTable('employees', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }
        })
        await queryInterface.createTable('employees_projects', {
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
        await queryInterface.dropTable('projects')
        await queryInterface.dropTable('employees')
        await queryInterface.dropTable('employees_projects')
    }
}