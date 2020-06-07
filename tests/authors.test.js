/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Author } = require('../src/models');
const app = require('../src/app');

describe('/authors', () => {
  before(async () => Author.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /authors', () => {
      it('creates a new author in the database', async () => {
        const response = await request(app).post('/authors').send({
          author: 'Jane Austen',
        });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(201);
        expect(newAuthorRecord.author).to.equal('Jane Austen');
      });

      it('returns an error if the author already exists', async () => {
        const response = await request(app).post('/authors').send({
          author: 'Jane Austen',
        });
        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.equal(
          'Authors.author must be unique'
        );
      });

      it('returns an error if an author has not been provided', async () => {
        const response = await request(app).post('/authors').send({});

        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.equal('The author is required.');
      });
    });
  });

  describe('with records in the database', () => {
    let authors;

    beforeEach(async () => {
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
    });

    describe('GET /authors', () => {
      it('gets all authors records', async () => {
        const response = await request(app).get('/authors');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id);

          expect(author.author).to.equal(expected.author);
        });
      });

      it('populates all books with the author', async () => {
        let author = authors[0];
        const genre = await request(app).post('/genres').send({
          genre: 'Magic',
        });
        const book = await request(app).post('/books').send({
          title: 'Harry Potter and the Chamber of Secrets',
          AuthorId: author.id,
          GenreId: genre.body.id,
        });

        const response = await request(app).get('/authors');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        const authorWithBook = response.body.find(
          (item) => item.id === author.id
        );
        expect(authorWithBook.Books[0].title).to.equal(book.body.title);
        expect(authorWithBook.Books[0].AuthorId).to.equal(book.body.AuthorId);
        expect(authorWithBook.Books[0].GenreId).to.equal(book.body.GenreId);
      });
    });

    describe('GET /authors/:id', () => {
      it('gets Author record by id', async () => {
        const author = authors[0];
        const response = await request(app).get(`/authors/${author.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.author).to.equal(author.author);
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app).get('/authors/123456');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });

    describe('PATCH /authors/:id', () => {
      it('updates authors name by id', async () => {
        const author = authors[0];
        const response = await request(app)
          .patch(`/authors/${author.id}`)
          .send({ author: 'Jojo Moyes' });

        const updatedAuthorRecord = await Author.findByPk(author.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedAuthorRecord.author).to.equal('Jojo Moyes');
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app)
          .patch('/authors/1233456')
          .send({ author: 'Jojo Moyes' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });

    describe('DELETE /authors/:id', () => {
      it('deletes author record by id', async () => {
        const author = authors[0];
        const response = await request(app).delete(`/authors/${author.id}`);

        expect(response.status).to.equal(204);

        const deletedAuthor = await Author.findByPk(author.id, { raw: true });

        expect(deletedAuthor).to.equal(null);
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app).delete('/authors/1359750340');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });
  });
});
