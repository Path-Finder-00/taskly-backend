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
            },
            created_at: {
                type: DataTypes.DATE
            },
            updated_at: {
                type: DataTypes.DATE
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
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            since: {
                type: DataTypes.DATE,
                allowNull: false
            },
            to: {
                type: DataTypes.DATE
            },
            employee_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'employees', key: 'id' }
            },
            project_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'projects', key: 'id' }
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('projects')
        await queryInterface.dropTable('employees')
        await queryInterface.dropTable('employees_projects')
    }
}