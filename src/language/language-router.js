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

    req.language = language;
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
      req.language.id
    );

    res.json({
      language: req.language,
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

    res.json({
      language: languages,
    });
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
    const languageMatch = req.language.filter(
      (language) => language.id.toString() === languageId.toString()
    )[0];
    res.json({ words: words, language: languageMatch });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post('/:id', async (req, res, next) => {
  res.json('ok');
});

languageRouter.put('/:id', bodyParser, async (req, res, next) => {
  res.json('ok');
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
    res.json({ message: 'title has been updated', name: name }).status(204);
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
      .json({ message: 'language deleted', language: deleteLanguage })
      .status(204);
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/word/:wordId', async (req, res, next) => {
  res.json('ok');
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
      .json({ message: 'New word has been created', newWord: addNewWord })
      .status(204);
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
    res.json(`The word with the id ${wordId} has been updated`).status(204);
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
      totalScore: req.language.total_score,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
    });
    next();
  } catch (error) {
    next(error.message);
  }
});

languageRouter.post('/guess', bodyParser, async (req, res, next) => {
  const guess = req.body.guess;
  if (!guess) {
    res.status(400).json({
      error: `Missing 'guess' in request body`,
    });
  }
  try {
    let words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );
    const [{ head }] = await LanguageService.getLanguageHead(
      req.app.get('db'),
      req.language.id
    );
    let list = LanguageService.createLinkedList(words, head);
    let [checkNextWord] = await LanguageService.checkGuess(
      req.app.get('db'),
      req.language.id
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
      req.language.total_score++;
      await LanguageService.updateWordsTable(
        req.app.get('db'),
        toArray(list),
        req.language.id,
        req.language.total_score
      );
      res.json({
        nextWord: list.head.value.original,
        totalScore: req.language.total_score,
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
        req.language.id,
        req.language.total_score
      );
      res.json({
        nextWord: list.head.value.original,
        totalScore: req.language.total_score,
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
