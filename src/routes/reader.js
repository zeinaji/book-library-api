const express = require('express');

const router = express.Router();
const readerController = require('../controllers/reader');

router
  .route('/')
  .get(readerController.getReaders)
  .post(readerController.createReader);

router
  .route('/:id')
  .get(readerController.getReaderById)
  .patch(readerController.updateReader)
  .delete(readerController.deleteReader);

module.exports = router;
