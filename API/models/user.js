'use strict';

const axios = require('axios');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.request, { foreignKey: 'user_id'});
    }
  }
  User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    auth0Id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "Auth0 ID already exists"
        },
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
        unique: {
            args: true,
            msg: "Phone number already exists"
        },
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
        defaultValue: 0.00,
        validate: {
            min: {
                args: [0.00],
                msg: "Cash must be a positive number"
            }
        }
    }
}, {
    sequelize,
    modelName: 'user',
  });

  User.prototype.CanAffordThisTransaction = async function (price, quantity) {
    return this.cash >= price * quantity;
    };

  User.prototype.updateBalance = async function (price, quantity, transaction) {
    const newBalance = this.cash - (price * quantity);
    await this.update({ cash: newBalance }, { transaction });
    };

    User.prototype.processUserLocation = async function (req) {
        const userIP = req.connection.remoteAddress || req.ip || req.headers['x-forwarded-for'];
        // const userIP = "2800:300:6713:c9f0::3"
        try {
            const ipInfo = await axios.get(`http://ipinfo.io/${userIP}?token=${process.env.IP_INFO_TOKEN}`);
            return `${ipInfo?.data?.city || "Unknown"}, ${ipInfo?.data?.region || "Unknown"}, ${ipInfo?.data?.country || "Unknown"}`;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

  return User;
};