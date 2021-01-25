const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { LinkedList, toArray, _Node } = require('../linkedList');
const bodyParser = express.json();

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.languages = language;
    next();
  } catch (error) {
    next(error);
  }
});

// Question, does this return all of the languages for a user or just one?
languageRouter.get('/user', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.languages.id
    );

    res.json({
      language: req.languages,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const languages = await LanguageService.getLanguages(req.app.get('db'));

    res
      .json({
        language: languages,
      })
      .status(200);
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post('/', bodyParser, async (req, res, next) => {
  try {
    const { name } = req.body;
    const languages = await LanguageService.addNewLanguage(
      req.app.get('db'),
      name,
      req.user.id
    );

    res.json({
      language: languages,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/:id', async (req, res, next) => {
  const languageId = req.params.id;
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      languageId
    );
    const languageMatch = req.languages.filter(
      (language) => language.id.toString() === languageId.toString()
    )[0];
    res.json({ words: words, language: languageMatch }).status(200);
    next();
  } catch (error) {
    next(error);
  }
});

// this updates the language table to allow public access to decks
languageRouter.put('/:id/access', bodyParser, async (req, res, next) => {
  try {
    const languageId = req.params.id;
    const { access } = req.body;
    console.log('this is the value of access', access);
    const updateLanguageTitle = await LanguageService.updateLanguageAccess(
      req.app.get('db'),
      languageId,
      { is_public: access }
    );
    res
      .status(200)
      .json({ message: 'access status has been updated', access: access });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.put('/:id/title', bodyParser, async (req, res, next) => {
  try {
    const languageId = req.params.id;
    const { name } = req.body;
    const updateLanguageTitle = await LanguageService.updateLanguageTitle(
      req.app.get('db'),
      languageId,
      { name: name }
    );
    res.status(202).json({ message: 'title has been updated', name: name });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.delete('/:id', async (req, res, next) => {
  try {
    const languageId = req.params.id;
    const deleteLanguage = await LanguageService.deleteLanguage(
      req.app.get('db'),
      languageId
    );
    res
      .send(202)
      .json({ message: 'language deleted', language: deleteLanguage });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post('/:id/word/', bodyParser, async (req, res, next) => {
  try {
    const languageId = req.params.id;
    const newWord = req.body;
    const addNewWord = await LanguageService.addNewWord(
      req.app.get('db'),
      languageId,
      newWord
    );
    res
      .status(202)
      .json({ message: 'New word has been created', newWord: addNewWord });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.put('/word/:wordId', bodyParser, async (req, res, next) => {
  try {
    const wordId = req.params.wordId;
    const { original, translation } = req.body;
    const updateWord = await LanguageService.updateWord(
      req.app.get('db'),
      wordId,
      { original: original, translation: translation }
    );
    res.status(202).json(`The word with the id ${wordId} has been updated`);
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.delete('/word/:wordId', async (req, res, next) => {
  try {
    const wordId = req.params.wordId;
    const deleteWord = await LanguageService.deleteWord(
      req.app.get('db'),
      wordId
    );
    res.json(`The word with the id ${wordId} has been deleted`).status(204);
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/:id/head', async (req, res, next) => {
  try {
    const languageId = req.params.id;
    const [nextWord] = await LanguageService.getNextWord(
      req.app.get('db'),
      languageId
    );
    res.json({
      nextWord: nextWord.original,
      totalScore: req.languages.total_score,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
    });
    next();
  } catch (error) {
    next(error.message);
  }
});

languageRouter.post('/:id/guess', bodyParser, async (req, res, next) => {
  const languageId = req.params.id;
  const [languageObj] = req.languages.filter(
    (lang) => lang.id.toString() == languageId.toString()
  );
  // need to make this a query that gets the real score of the languageId.
  console.log(
    'this is the total score value and languageObj, req.langauge, and languageId ',
    languageObj,
    req.languages,
    languageId
  );
  const guess = req.body.guess;
  //console.log('this is the guess and the language id', guess, languageId)
  if (!guess) {
    res.status(400).json({
      error: `Missing 'guess' in request body`,
    });
  }
  try {
    let words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      languageId
    );
    const [{ head }] = await LanguageService.getLanguageHead(
      req.app.get('db'),
      languageId
    );
    let list = LanguageService.createLinkedList(words, head);
    let [checkNextWord] = await LanguageService.checkGuess(
      req.app.get('db'),
      languageId
    );
    if (checkNextWord.translation === guess) {
      let newMemVal = list.head.value.memory_value * 2;
      list.head.value.memory_value = newMemVal;
      list.head.value.correct_count++;

      let curr = list.head;
      let countDown = newMemVal;
      while (countDown > 0 && curr.next !== null) {
        curr = curr.next;
        countDown--;
      }
      let temp = new _Node(list.head.value);

      if (curr.next === null) {
        temp.next = curr.next;
        curr.next = temp;
        list.head = list.head.next;
        curr.value.next = temp.value.id;
        temp.value.next = null;
      } else {
        temp.next = curr.next;
        curr.next = temp;
        list.head = list.head.next;
        curr.value.next = temp.value.id;
        temp.value.next = temp.next.value.id;
      }
      const newTotalScore = await LanguageService.updateTotalScore(
        req.app.get('db'),
        languageObj.id,
        languageObj.total_score + 1
      );
      await LanguageService.updateWordsTable(
        req.app.get('db'),
        toArray(list),
        languageId,
        languageObj.total_score + 1
      );
      res.json({
        nextWord: list.head.value.original,
        totalScore: languageObj.total_score,
        wordCorrectCount: list.head.value.correct_count,
        wordIncorrectCount: list.head.value.incorrect_count,
        answer: temp.value.translation,
        isCorrect: true,
      });
    } else {
      list.head.value.memory_value = 1;
      list.head.value.incorrect_count++;

      let curr = list.head;
      let countDown = 1;
      while (countDown > 0) {
        curr = curr.next;
        countDown--;
      }

      let temp = new _Node(list.head.value);
      temp.next = curr.next;
      curr.next = temp;
      list.head = list.head.next;
      curr.value.next = temp.value.id;
      temp.value.next = temp.next.value.id;

      await LanguageService.updateWordsTable(
        req.app.get('db'),
        toArray(list),
        languageId,
        languageObj.total_score
      );
      res.json({
        nextWord: list.head.value.original,
        totalScore: languageObj.total_score,
        wordCorrectCount: list.head.value.correct_count,
        wordIncorrectCount: list.head.value.incorrect_count,
        answer: temp.value.translation,
        isCorrect: false,
      });
    }
    next();
  } catch (error) {
    next(error.message);
  }
});

module.exports = languageRouter;
