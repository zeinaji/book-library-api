module.exports = (sequelize, DataTypes) => {
  const schema = {
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'The genre is required.',
        },
        notEmpty: {
          args: true,
          msg: 'The genre is required.',
        },
      },
    },
  };

  return sequelize.define('Genre', schema);
};
