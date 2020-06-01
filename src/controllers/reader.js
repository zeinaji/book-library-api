const helperFunctions = require('../helpers/helper-functions');

const getReaders = (req, res) =>
  helperFunctions.getAllItems(req, res, 'reader');

const createReader = (req, res) =>
  helperFunctions.createItem(req, res, 'reader');

const updateReader = (req, res) =>
  helperFunctions.updateItem(req, res, 'reader');

const getReaderById = (req, res) =>
  helperFunctions.getItemById(req, res, 'reader');

const deleteReader = (req, res) =>
  helperFunctions.deleteItem(req, res, 'reader');

module.exports = {
  getReaders,
  getReaderById,
  createReader,
  updateReader,
  deleteReader,
};
