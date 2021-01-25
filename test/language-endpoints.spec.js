const { expect } = require('chai');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Language Endpoints', function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const [testUser] = testUsers;
  const [testLanguages, testWords] = helpers.makeLanguagesAndWords(testUser);

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));


  /**
   * @description Get languages for a user
   **/
  describe(`GET /api/language`, () => {
    const [usersLanguage] = testLanguages.filter(
      (lang) => lang.user_id === testUser.id
    );
    const usersWords = testWords.filter(
      (word) => word.language_id === usersLanguage.id
    );

    beforeEach('insert users, languages and words', () => {
      return helpers.seedUsersLanguagesWords(
        db,
        testUsers,
        testLanguages,
        testWords
      );
    });

    it(`responds with 200 and user's language and words`, () => {
      return supertest(app)
        .get(`/api/language`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.keys('language');
          expect(res.body.language[0]).to.have.property('id', usersLanguage.id);
          expect(res.body.language[0]).to.have.property(
            'name',
            usersLanguage.name
          );
          expect(res.body.language[0]).to.have.property(
            'user_id',
            usersLanguage.user_id
          );
          expect(res.body.language[0]).to.have.property('total_score', 0);
          expect(res.body.language[0]).to.have.property('head').which.is.not
            .null;
        });
    });
  });

  /**
   * @description Get head from language
   **/
  describe(`GET /api/language/head`, () => {
    const usersLanguage = testLanguages.find((l) => l.user_id === testUser.id);
    const headWord = testWords.find((w) => w.language_id === usersLanguage.id);

    beforeEach('insert users, languages and words', () => {
      return helpers.seedUsersLanguagesWords(
        db,
        testUsers,
        testLanguages,
        testWords
      );
    });
  });
  /**
   * @description Getting a Language by id
   **/

  describe('/api/language/:id', () => {
    const [usersLanguage] = testLanguages.filter(
      (lang) => lang.user_id === testUser.id
    );
    const usersWords = testWords.filter(
      (word) => word.language_id === usersLanguage.id
    );

    beforeEach('insert users, languages and words', () => {
      return helpers.seedUsersLanguagesWords(
        db,
        testUsers,
        testLanguages,
        testWords
      );
    });

    it(` GET returns a object with words and languages based on the language id passed through the path URL`, () => {
      return supertest(app)
        .get(`/api/language/1`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body.language.name).to.eql(testLanguages[0].name);
          expect(res.body.language).to.have.property('head');
          expect(res.body.language).to.have.property('total_score');
          expect(res.body.words[0].original).to.eql(testWords[0].original);
          expect(res.body.words[0].translation).to.eql(
            testWords[0].translation
          );
          expect(res.body.words[0]).to.have.property('memory_value');
          expect(res.body.words[0]).to.have.property('correct_count');
          expect(res.body.words[0]).to.have.property('incorrect_count');
        });
    });

    it(` PUT updates the access status of a language based on the id`, () => {
      return supertest(app)
        .put(`/api/language/1/access`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send({ access: true })
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.property('access');
          expect(res.body).to.have.property('message');
        });
    });

    it(` PUT updates the title of the language name`, () => {
      return supertest(app)
        .put(`/api/language/1/title`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send({ name: 'test' })
        .expect(202)
        .expect((res) => {
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('message');
        });
    });

    it(`DELETE removes a language based on the id passed`, () => {
      return supertest(app)
        .delete(`/api/language/1`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200);
    });

    it(`POST adds a new word`, () => {
      return supertest(app)
        .post(`/api/language/1/word`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send({ original: 'word', translation: 'word' })
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property('message');
          expect(res.body.newWord.original).to.eql('word');
          expect(res.body.newWord.translation).to.eql('word');
          expect(res.body.newWord).to.have.property('id');
          expect(res.body.newWord).to.have.property('language_id');
        });
    });

    it(`PUT edits a word and translation`, () => {
      return supertest(app)
        .put(`/api/language/word/1`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send({ original: 'word', translation: 'word' })
        .expect(202)
        .expect((res) => {
          expect(res.body).to.eql('The word with the id 1 has been updated');
        });
    });

    it(`DELETE removes a word `, () => {
      return supertest(app)
        .delete(`/api/language/word/1`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body).to.eql('The word with the id 1 has been deleted');
        });
    });

    it(`GET returns the word at the head of a language`, () => {
      return supertest(app)
        .get(`/api/language/1/head`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body.nextWord).to.eql('original 1');
          expect(res.body.wordCorrectCount).to.eql(0);
          expect(res.body.wordIncorrectCount).to.eql(0);
        });
    });

    it(`POST checks the users guess to see if it's correct then auto increments the related values`, () => {
      return supertest(app)
        .post(`/api/language/1/guess`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send({ guess: 'guess' })
        .expect(202)
        .expect((res) => {
          expect(res.body).to.have.property('nextWord');
          expect(res.body).to.have.property('isCorrect');
          expect(res.body).to.have.property('totalScore');
          expect(res.body).to.have.property('wordCorrectCount');
          expect(res.body).to.have.property('answer');
          expect(res.body).to.have.property('wordIncorrectCount');
        });
    });
  });
});
