const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Not an email."
            }
        }
    },
    passwordHash: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isPhoneNumber(phoneNumber) {
                const phoneNumberPattern = /^(?:\+\d{1,4}[0-9]{0,9}|\d{9})$/;
                if (!phoneNumberPattern.test(phoneNumber)) {
                    throw new Error("Not a phone number.")
                }
            }
        }
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    accessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'accesses', key: 'id' }
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'id' }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user'
})

module.exports = User