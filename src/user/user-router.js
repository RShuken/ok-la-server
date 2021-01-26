const express = require('express')
const path = require('path')
const UserService = require('./user-service')
const { requireAuth } = require('../middleware/jwt-auth');
const userRouter = express.Router()
const jsonBodyParser = express.json()

userRouter
  .get('/', requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const languages = await UserService.getLanguagesWithUserId(
        req.app.get('db'),
        user_id
      );
      res.json(languages).status(200);
    } catch (error) {
      next(error);
    }
  })
  .post('/', jsonBodyParser, async (req, res, next) => {
    const { password, username, name } = req.body;


    for (const field of ['name', 'username', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        });

    try {
      const passwordError = UserService.validatePassword(password);

      if (passwordError) return res.status(400).json({ error: passwordError });

      const hasUserWithUserName = await UserService.hasUserWithUserName(
        req.app.get('db'),
        username
      );

      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });

      const hashedPassword = await UserService.hashPassword(password);

      const newUser = {
        username,
        password: hashedPassword,
        name,
      };

      const user = await UserService.insertUser(req.app.get('db'), newUser);
      // when a user signs up this populates the french language for them right away. 
      await UserService.populateUserWordsAtSignup(req.app.get('db'), user.id, 1);

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(UserService.serializeUser(user));
    } catch (error) {
      next(error);
    }
  })
  .post('/deck/:id', requireAuth, jsonBodyParser, async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const language_id = req.params.id;
      const languages = await UserService.populateUserWordsByLanguageId(
        req.app.get('db'),
        user_id,
        language_id
      );
      res.json(languages).status(200);
    } catch (error) {
      next(error);
    }
  });

module.exports = userRouter
