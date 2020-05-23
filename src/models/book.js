module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validation: {
        notNull: {
          args: [true],
          msg: 'We need a book title',
        },
        notEmpty: {
          args: [true],
          msg: 'The book title cannot be empty',
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validation: {
        notNull: {
          args: [true],
          msg: 'We need a book author',
        },
        notEmpty: {
          args: [true],
          msg: 'The book author cannot be empty',
        },
      },
    },
    ISBN: DataTypes.STRING,
  };

  return sequelize.define('Book', schema);
};
