const helperFunctions = require('../helpers/helper-functions');

const createBook = (req, res) => helperFunctions.createItem(req, res, 'book');

const getBooks = (req, res) => helperFunctions.getAllItems(req, res, 'book');

const getBookById = (req, res) => helperFunctions.getItemById(req, res, 'book');

const updateBook = (req, res) => helperFunctions.updateItem(req, res, 'book');

const deleteBook = (req, res) => helperFunctions.deleteItem(req, res, 'book');

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};
