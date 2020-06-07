module.exports = (sequelize, DataTypes) => {
  const schema = {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'An email address is required.',
        },
        notEmpty: {
          args: true,
          msg: 'An email address is required.',
        },
        isEmail: {
          args: true,
          msg: 'Please provide a valid email address.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required.',
        },
        notEmpty: {
          args: true,
          msg: 'A password is required.',
        },
        len: {
          args: [8, 32],
          msg: 'Password must be longer than 8 characters.',
        },
      },
    },
  };

  return sequelize.define('Reader', schema);
};
