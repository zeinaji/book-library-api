const helperFunctions = require('../helpers/helper-functions');

const createGenre = (req, res) => helperFunctions.createItem(req, res, 'genre');

const getGenres = (req, res) => helperFunctions.getAllItems(req, res, 'genre');

const getGenreById = (req, res) =>
  helperFunctions.getItemById(req, res, 'genre');

const updateGenre = (req, res) => helperFunctions.updateItem(req, res, 'genre');

const deleteGenre = (req, res) => helperFunctions.deleteItem(req, res, 'genre');

module.exports = {
  createGenre,
  getGenres,
  getGenreById,
  updateGenre,
  deleteGenre,
};
