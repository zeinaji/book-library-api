module.exports = (sequelize, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'The author is required.',
        },
        notEmpty: {
          args: true,
          msg: 'The author is required.',
        },
      },
    },
  };
  return sequelize.define('Author', schema);
};
