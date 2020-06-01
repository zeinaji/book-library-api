/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          title: 'Pride and Prejudice',
          author: 'Jane Austen',
          genre: 'Fiction',
          ISBN: 1376940204,
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(newBookRecord.title).to.equal('Pride and Prejudice');
        expect(newBookRecord.author).to.equal('Jane Austen');
        expect(newBookRecord.genre).to.equal('Fiction');
        expect(newBookRecord.ISBN).to.equal(1376940204);
      });

      it('returns an error if a title has not been provided', async () => {
        const response = await request(app).post('/books').send({
          author: 'Jane Austen',
          genre: 'Fiction',
          ISBN: 1376940204,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.equal('A title must be provided.');
      });

      it('returns an error if an author has not been provided', async () => {
        const response = await request(app).post('/books').send({
          title: 'Pride and Prejudice',
          genre: 'Fiction',
          ISBN: 1376940204,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.equal('An author must be provided.');
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      await Book.destroy({ where: {} });

      books = await Promise.all([
        Book.create({
          title: 'Harry Potter',
          author: 'J.K. Rowling',
          genre: 'Fiction',
          ISBN: 123,
        }),
        Book.create({
          title: 'One Hundred Years of Solitude',
          author: 'Gabriel Garcia Markez',
          genre: 'Fiction',
          ISBN: 456,
        }),
        Book.create({
          title: 'Normal People',
          author: 'Sally Rooney',
          genre: 'Fiction',
          ISBN: 789,
        }),
      ]);
    });

    describe('GET /readers', () => {
      it('gets all books records', async () => {
        const response = await request(app).get('/books');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe('GET /books/:id', () => {
      it('gets book record by id', async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.genre).to.equal(book.genre);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).get('/books/123456');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates books genre by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ genre: 'Non-fiction' });

        const updatedBookRecord = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.genre).to.equal('Non-fiction');
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app)
          .patch('/books/1233456')
          .send({ genre: 'Non-fiction' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('DELETE /books/:id', () => {
      it('deletes book record by id', async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);

        expect(response.status).to.equal(204);

        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(deletedBook).to.equal(null);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).delete('/books/1359750340');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });
});
