const express = require('express');
const router = express.Router();
const authorController = require('../controllers/author');

router
  .route('/')
  .get(authorController.getAuthors)
  .post(authorController.createAuthor);

router
  .route('/:id')
  .get(authorController.getAuthorById)
  .patch(authorController.updateAuthor)
  .delete(authorController.deleteAuthor);

module.exports = router;
