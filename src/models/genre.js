module.exports = (sequelize, DataTypes) => {
  const schema = {
    genre: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validation: {
        notNull: {
          args: [true],
          msg: 'We need a genre in so that we can create one',
        },
        notEmpty: {
          args: [true],
          msg: 'We need a genre in so that we can create one',
        },
      },
    },
  };

  return sequelize.define('Genre', schema);
};
