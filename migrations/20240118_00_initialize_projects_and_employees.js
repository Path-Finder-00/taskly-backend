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
                type: DataTypes.STRING(80),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(150),
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
        await queryInterface.createTable('employee_projects', {
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
        await queryInterface.dropTable('projects')
        await queryInterface.dropTable('employees')
        await queryInterface.dropTable('employee_projects')
    }
}