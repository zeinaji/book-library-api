/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Book, Genre, Author } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const author = await request(app).post('/authors').send({
          author: 'Jane Austen',
        });

        const genre = await request(app).post('/genres').send({
          genre: 'Classic',
        });
        const response = await request(app).post('/books').send({
          title: 'Pride and Prejudice',
          AuthorId: author.body.id,
          GenreId: genre.body.id,
          ISBN: 1376940204,
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(newBookRecord.title).to.equal('Pride and Prejudice');
        expect(newBookRecord.AuthorId).to.equal(author.body.id);
        expect(newBookRecord.GenreId).to.equal(genre.body.id);
        expect(newBookRecord.ISBN).to.equal(1376940204);
      });

      it('returns an error if a title has not been provided', async () => {
        const response = await request(app).post('/books').send({
          ISBN: 1376940204,
        });

        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.equal('A title must be provided.');
      });
    });
  });

  describe('with records in the database', () => {
    let books;
    let genres;
    let authors;

    beforeEach(async () => {
      await Book.destroy({ where: {} });
      await Genre.destroy({ where: {} });
      await Author.destroy({ where: {} });

      authors = await Promise.all([
        Author.create({
          author: 'J.K. Rowling',
        }),
        Author.create({
          author: 'Gabriel Garcia Markez',
        }),
        Author.create({
          author: 'Sally Rooney',
        }),
      ]);

      genres = await Promise.all([
        Genre.create({
          genre: 'Fantasy',
        }),
        Genre.create({
          genre: 'Magical Realism',
        }),
        Genre.create({
          genre: 'Romance',
        }),
      ]);

      books = await Promise.all([
        Book.create({
          title: 'Harry Potter',
          AuthorId: authors[0].dataValues.id,
          GenreId: genres[0].dataValues.id,
          ISBN: 123,
        }),
        Book.create({
          title: 'One Hundred Years of Solitude',
          AuthorId: authors[1].dataValues.id,
          GenreId: genres[1].dataValues.id,
          ISBN: 456,
        }),
        Book.create({
          title: 'Normal People',
          AuthorId: authors[2].dataValues.id,
          GenreId: genres[2].dataValues.id,
          ISBN: 789,
        }),
      ]);
    });

    describe('GET /books', () => {
      it('gets all books records', async () => {
        const response = await request(app).get('/books');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);
          expect(book.title).to.equal(expected.title);
          expect(book.AuthorId).to.equal(expected.AuthorId);
          expect(book.GenreId).to.equal(expected.GenreId);
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
        expect(response.body.AuthorId).to.equal(book.AuthorId);
        expect(response.body.GenreId).to.equal(book.GenreId);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it('populates the author and genre with the book', async () => {
        const book = books[0];
        const genre = genres[0];
        const author = authors[0];

        const response = await request(app).get(`/books/${book.id}`);

        expect(response.body.Genre.id).to.equal(genre.id);
        expect(response.body.Genre.genre).to.equal(genre.genre);
        expect(response.body.Author.id).to.equal(author.id);
        expect(response.body.Author.author).to.equal(author.author);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).get('/books/123456');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates books title by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ title: 'Immortals' });

        const updatedBookRecord = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.title).to.equal('Immortals');
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app)
          .patch('/books/1233456')
          .send({ title: 'Immortals' });

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
