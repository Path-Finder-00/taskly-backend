const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('users', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            surname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: {
                        msg: "Not an email."
                    }
                }
            },
            password_hash: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            // TODO - write a validator for checking wheter it is a proper phone number
            phone: {
                type: DataTypes.STRING,
                allowNull: false
            },
            disabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
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
        await queryInterface.dropTable('users')
    }
}