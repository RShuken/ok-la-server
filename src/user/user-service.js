const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UserService = {
  hasUserWithUserName(db, username) {
    return db('user')
      .where({ username })
      .first()
      .then((user) => !!user);
  },
  getLanguagesWithUserId(db, user_id) {
    return db('language')
      .where({ user_id })
      .returning('*')
      .then((user_languages) => user_languages);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('user')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
    };
  },
  // this is no longer used since it's static and I want it to be dynamic, I rewrote this whole thing below.
  populateUserWords(db, user_id) {
    return db.transaction(async (trx) => {
      const [languageId] = await trx
        .into('language')
        .insert([{ name: 'French', user_id }], ['id']);

      // when inserting words,
      // we need to know the current sequence number
      // so that we can set the `next` field of the linked language
      const seq = await db.from('word_id_seq').select('last_value').first();

      const languageWords = [
        ['amour', 'love', 2],
        ['bonjour', 'hello', 3],
        ['bonheur', 'happiness', 4],
        ['sourire', 'smile', 5],
        ['francais', 'french', 6],
        ['oui', 'yes', 7],
        ['chien', 'dog', 8],
        ['chat', 'cat', null],
      ];

      const [languageHeadId] = await trx.into('word').insert(
        languageWords.map(([original, translation, nextInc]) => ({
          language_id: languageId.id,
          original,
          translation,
          next: nextInc ? Number(seq.last_value) + nextInc : null,
        })),
        ['id']
      );

      await trx('language').where('id', languageId.id).update({
        head: languageHeadId.id,
      });
    });
  },
  populateUserWordsByLanguageId(db, user_id, language_id) {
    return db.transaction(async (trx) => {
      // this should be an array of object that represents a join between the language and word tables, that contains all words associated with a language id.
      console.log(
        'this is the user id and the languageId',
        user_id,
        language_id
      );
      const languageNameNew = await trx
        .into('language')
        .where({ id: language_id })
        .select('name');

      console.log(' this is the language name', languageNameNew);

      const [languageId] = await trx
        .into('language')
        .insert([{ name: languageNameNew[0].name, user_id }], ['id']);

      console.log(' this is the languageId', languageId);

      const languageWordArray = await trx
        .from('word')
        .where({ language_id: language_id })
        .select('original', 'translation', 'next');

      console.log('this is the languageWordArray', languageWordArray);

      const seq = await db.from('word_id_seq').select('last_value').first();

      const mapOverWords = languageWordArray.map(
        ({ original, translation, next }, index) => ({
          language_id: languageId.id,
          original,
          translation,
          next: next ? Number(seq.last_value) + index + 2 : null,
        })
      );

      console.log('this is the map over words array', mapOverWords);
      const [languageHeadId] = await trx
        .into('word')
        .insert(mapOverWords, 'id');
      console.log('this is the languageHeadId', languageHeadId);

      await trx('language').where({ id: languageId.id }).update({
        head: languageHeadId,
      });
    });
  },
  populateUserWordsAtSignup(db, user_id, language_id) {
    return db.transaction(async (trx) => {
      const languageNameNew = await trx
        .into('language')
        .where({ id: language_id })
        .select('name');

        console.log(
          'this is the name of the new data base',
          languageNameNew[0].name
        );
      const [languageId] = await trx
        .into('language')
        .insert([{ name: languageNameNew[0].name, user_id }], ['id']);

      const languageWordArray = await trx
        .from('word')
        .where({ language_id: language_id })
        .select('original', 'translation', 'next');

      const seq = await db.from('word_id_seq').select('last_value').first();

      const mapOverWords = languageWordArray.map(
        ({ original, translation, next }, index) => ({
          language_id: languageId.id,
          original,
          translation,
          next: next ? Number(seq.last_value) + index + 2 : null,
        })
      );

      const [languageHeadId] = await trx
        .into('word')
        .insert(mapOverWords, 'id');

      await trx('language').where({ id: languageId.id }).update({
        head: languageHeadId,
      });
    });
  },
};
module.exports = UserService;
