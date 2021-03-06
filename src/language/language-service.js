const { LinkedList } = require('../linkedList');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
        'language.is_public'
      )
      .where('language.user_id', user_id)
      .returning('*');
  },
  getLanguages(db) {
    return db
      .from('language')
      .where({ is_public: true })
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
        'language.is_public'
      )
      .returning('*');
  },
  deleteLanguage(db, languageId) {
    return db.from('language').where({ id: languageId }).del();
  },
  deleteWord(db, wordId) {
    return db.from('word').where({ id: wordId }).del();
  },
  updateWord(db, wordId, updateObject) {
    return db.from('word').where({ id: wordId }).update(updateObject);
  },
  updateLanguageTitle(db, languageId, name) {
    return db.from('language').where({ id: languageId }).update(name);
  },
  updateLanguageAccess(db, languageId, is_public) {
    return db.from('language').where({ id: languageId }).update(is_public);
  },
  addNewLanguage(db, name, userId) {
    const newLanguage = {
      name: name,
      total_score: 0,
      user_id: userId,
      head: null,
    };
    return db
      .insert(newLanguage)
      .into('language')
      .returning('*')
      .then(([language]) => language);
  },
  addNewWord: async (db, languageId, newWord) => {
    const [lastNext] = await db
      .from('word')
      .where({ language_id: languageId, next: null });

    const [maxNext] = await db
      .from('word')
      .where({ language_id: languageId })
      .max('next');

    const newWordObject = {
      original: newWord.original,
      translation: newWord.translation,
      memory_value: 1,
      correct_count: 0,
      incorrect_count: 0,
      language_id: languageId,
      next: null,
    };

    const insertNewWord = await db
      .insert(newWordObject)
      .into('word')
      .returning('*')
      .then(([word]) => word);

    const seq = await db.from('word_id_seq').select('last_value').first();
    const oldWordObject = {
      next: seq.last_value,
    };

    const [languageObject] = await db
      .from('language')
      .where({ id: languageId })
      .returning('*');

    if (languageObject.head !== null) {
      const UpdateOldWordNextValue = await db
        .from('word')
        .where({ id: lastNext.id })
        .update(oldWordObject);
    } else {
      const insertNewHead = await db
        .from('language')
        .where({ id: languageId })
        .update({ head: insertNewWord.id });
    }

    return insertNewWord;
  },
  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },
  getTotalScore(db, language_id) {
    return db.from('language').select('total_score').where({ id: language_id });
  },
  updateTotalScore(db, language_id, totalScore) {
    const newScore = totalScore + 1;
    return (
      db
        .from('language')
        //.select('total_score')
        .where({ id: language_id })
        .update({ total_score: newScore })
    );
  },

  getLanguageHead(db, language_id) {
    return db
      .from('language')
      .join('word', 'word.language_id', '=', 'language.id')
      .select('head')
      .groupBy('head')
      .where({ language_id });
  },

  getNextWord(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'original',
        'translation',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },

  checkGuess(db, language_id) {
    return db
      .from('word')
      .join('language', 'word.id', '=', 'language.head')
      .select('*')
      .where({ language_id });
  },
  // What does the two functions below do?
  createLinkedList(words, head) {
    const headObj = words.find((word) => word.id === head);
    const headIndex = words.indexOf(headObj);
    const headNode = words.splice(headIndex, 1);

    const list = new LinkedList();
    list.insertLast(headNode[0]);

    let nextId = headNode[0].next;
    let currentWord = words.find((word) => word.id === nextId);
    list.insertLast(currentWord);
    nextId = currentWord.next;
    currentWord = words.find((word) => word.id === nextId);

    while (currentWord !== null) {
      list.insertLast(currentWord);
      nextId = currentWord.next;
      if (nextId === null) {
        currentWord = null;
      } else {
        currentWord = words.find((word) => word.id === nextId);
      }
    }
    return list;
  },

  updateWordsTable(db, words, language_id, total_score) {
    return db.transaction(async (trx) => {
      return Promise.all([
        trx('language').where({ id: language_id }).update({
          total_score,
          head: words[0].id,
        }),
        ...words.map((word, i) => {
          if (i + 1 >= words.length) {
            word.next = null;
          } else {
            word.next = words[i + 1].id;
          }
          return trx('word')
            .where({ id: word.id })
            .update({
              ...word,
            });
        }),
      ]);
    });
  },
};

module.exports = LanguageService;
