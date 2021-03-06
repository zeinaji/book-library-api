module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title must be provided.',
        },
        notEmpty: {
          args: true,
          msg: 'A title must be provided.',
        },
      },
    },
    ISBN: DataTypes.INTEGER,
  };

  return sequelize.define('Book', schema);
};
