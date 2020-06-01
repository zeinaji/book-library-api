module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title must be provided.',
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'An author must be provided.',
        },
      },
    },

    genre: DataTypes.STRING,
    ISBN: DataTypes.INTEGER,
  };

  return sequelize.define('Book', schema);
};
