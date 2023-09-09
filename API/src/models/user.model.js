const sequelize = require('../db/db')
const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: {
            args: true,
            msg: "Username already exists"
        },
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Username cannot be empty"
            },
            len: {
                args: [3, 20],
            }
        }
    }, 
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
            msg: 'Password must be at least 8 characters long and contain at least one number, one letter, and one special character.'
          }          
        }
      },
    email: {
        type: DataTypes.STRING,
        unique: {
            args: true,
            msg: "Email already exists"
        },
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Email must be a valid email address"
            }
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "First name cannot be empty"
            },
            len: {
                args: [3, 20],
            }
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Last name cannot be empty"
            },
            len: {
                args: [3, 20],
            }
        }
    },
    phone: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Phone number cannot be empty"
            },
            len: {
                args: [8],
                msg: "Phone number must be 10 digits long"
            }
        }
    },
    cash: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 5000.00,
        validate: {
            min: {
                args: [0.00],
                msg: "Cash must be a positive number"
            }
        }
    }
}, 
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true
    }
)

User.addHook('beforeCreate', async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = hashedPassword
  })

User.prototype.isPasswordValid = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        console.log(error)
    }
}

module.exports = User