const helperFunctions = require('../helpers/helper-functions');

const createAuthor = (req, res) =>
  helperFunctions.createItem(req, res, 'author');

const getAuthors = (req, res) =>
  helperFunctions.getAllItems(req, res, 'author');

const getAuthorById = (req, res) =>
  helperFunctions.getItemById(req, res, 'author');

const updateAuthor = (req, res) =>
  helperFunctions.updateItem(req, res, 'author');

const deleteAuthor = (req, res) =>
  helperFunctions.deleteItem(req, res, 'author');

module.exports = {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
