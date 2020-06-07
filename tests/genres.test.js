/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genres', () => {
  before(async () => Genre.sequelize.sync());

  describe('with no records in the database', () => {
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        const response = await request(app).post('/genres').send({
          genre: 'History',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(newGenreRecord.genre).to.equal('History');
      });

      it('returns an error if the genre already exists', async () => {
        const response = await request(app).post('/genres').send({
          genre: 'History',
        });
        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.equal('Genres.genre must be unique');
      });

      it('returns an error if a genre has not been provided', async () => {
        const response = await request(app).post('/genres').send({});

        expect(response.status).to.equal(400);
        expect(response.body.errors[0]).to.equal('The genre is required.');
      });
    });
  });

  describe('with records in the database', () => {
    let genres;

    beforeEach(async () => {
      await Genre.destroy({ where: {} });

      genres = await Promise.all([
        Genre.create({
          genre: 'Fiction',
        }),
        Genre.create({
          genre: 'Non-Fiction',
        }),
        Genre.create({
          genre: 'Fantasy',
        }),
      ]);
    });

    describe('GET /genres', () => {
      it('gets all genres records', async () => {
        const response = await request(app).get('/genres');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);

          expect(genre.genre).to.equal(expected.genre);
        });
      });

      it('populates all books with the genres', async () => {
        let genre = genres[0];
        const author = await request(app).post('/authors').send({
          author: 'Milan Kundera',
        });
        const book = await request(app).post('/books').send({
          title: 'The Unbearable Lightness of Being',
          AuthorId: author.body.id,
          GenreId: genre.id,
        });

        const response = await request(app).get('/genres');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        const genreWithBook = response.body.find(
          (item) => item.id === genre.id
        );
        expect(genreWithBook.Books[0].title).to.equal(book.body.title);
        expect(genreWithBook.Books[0].AuthorId).to.equal(book.body.AuthorId);
        expect(genreWithBook.Books[0].GenreId).to.equal(book.body.GenreId);
      });
    });

    describe('GET /genres/:id', () => {
      it('gets genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
      });

      it('returns a 404 if the Genre does not exist', async () => {
        const response = await request(app).get('/genres/123456');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('PATCH /genres/:id', () => {
      it('updates genre by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: 'Crime' });

        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal('Crime');
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .patch('/genres/1233456')
          .send({ genre: 'Crime' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('DELETE /genres/:id', () => {
      it('deletes genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).delete(`/genres/${genre.id}`);

        expect(response.status).to.equal(204);

        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(deletedGenre).to.equal(null);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).delete('/genres/1359750340');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  });
});
