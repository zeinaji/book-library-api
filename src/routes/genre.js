const express = require('express');

const router = express.Router();
const {
  getGenres,
  createGenre,
  getGenreById,
  updateGenre,
  deleteGenre,
} = require('../controllers/genre');

router.route('/').get(getGenres).post(createGenre);

router.route('/:id').get(getGenreById).patch(updateGenre).delete(deleteGenre);

module.exports = router;
