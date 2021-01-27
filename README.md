# Ok Language Learning Server

- [Live_App](https://ok-la-client.vercel.app/)
- [Server_Side_Repo](https://github.com/RShuken/ok-la-server)
- [Client_Side_Repo](https://github.com/RShuken/ok-la-client)

## API Documentation

- [BASE_URL](https://ok-language-learning.herokuapp.com/api)

**Base Endpoints**
```
'/api/auth'
'/api/language'
'/api/user'
```
### User endpoints

` GET /user`

Example request/response
```
REQ BODY = {
    "id": "user"
}

RESPONSE = [{
    "name": "french",
    "head": "null",
    "is_public: "false",
    "user_id": "1"
}]

```
` POST /user`

Example request/response
```
REQ BODY = {
    "password": "password", 
    "username": "username",
    "name": "name"
}

RESPONSE = {
      id: user.id,
      name: user.name,
      username: user.username,
    }

```

` POST /user/deck/:id`


Example request/response
```
REQ BODY = {
        user_id: user_id,
        language_id: language_id
}

RESPONSE = {
    name: name
}

```

**Language Endpoints**

`GET /language/user `

Example request/response
```
REQ BODY = {

}

RESPONSE = {
      language: req.languages,
      words: []
    }

```

`GET /language`

Example request/response
```
REQ BODY = {}

RESPONSE =
        language: [{
    "name": "french",
    "head": "null",
    "is_public: "false",
    "user_id": "1"
},{
    "name": "french",
    "head": "null",
    "is_public: "false",
    "user_id": "1"
}]


```

`POST /language`


Example request/response
```
REQ BODY = {
    name: name
}

RESPONSE = {
    language: {
    "name": "french",
    "head": "null",
    "is_public: "false",
    "user_id": "1"
}
}

```

`GET /language/:id`


Example request/response
```
REQ BODY = {
    languageId: :id
}

RESPONSE = { words: [], language: {
    "name": "french",
    "head": "null",
    "is_public: "false",
    "user_id": "1"
} }

```
`PUT /language/:id/access`


Example request/response
```
REQ BODY = { is_public: access }

RESPONSE = { message: 'access status has been updated', access: access }

```

`PUT /language/:id/title`

Example request/response
```
REQ BODY = {
        name: name
}

RESPONSE = { message: 'title has been updated', name: name }

```

`DELETE /language/:id`


Example request/response
```
REQ BODY = {
        languageId: languageId
}

RESPONSE = `The language with the id ${languageId} has been deleted`

```

`POST /language/:id/word`


Example request/response
```
REQ BODY = {
        original: original,
        translation: translation
}

RESPONSE = { message: 'New word has been created', newWord: {
        original: original,
        translation: translation
} }

```

`PUT /language/word/:wordId`

Example request/response
```
REQ BODY = {
        original: original,
        translation: translation
}

RESPONSE = `The word with the id ${wordId} has been updated`

```

`DELETE language/word/:wordId`

Example request/response
```
REQ BODY = {
        wordId: wordId
}

RESPONSE = `The word with the id ${wordId} has been deleted`

```

`GET language/:id/head`

Example request/response
```
REQ BODY = {
       languageId: languageId
}

RESPONSE = {
      nextWord: nextWord.original,
      totalScore: req.languages.total_score,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
    }

```

`POST /language/:id/guess`

Example request/response
```
REQ BODY = {
       guess: guess
}

RESPONSE = {
        nextWord: list.head.value.original,
        totalScore: languageObj.total_score,
        wordCorrectCount: list.head.value.correct_count,
        wordIncorrectCount: list.head.value.incorrect_count,
        answer: temp.value.translation,
        isCorrect: true,
      }

```

## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin serverName
createdb -U dunder-mifflin serverName-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env TEST_DATABASE_URL=serverName-test npm run migrate
```

And `npm test` should work at this point

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`

### Front-end technologies

Reactjs, HTML, CSS, JavaScript

### Back-end technologies

Node.js, Express

### Database

PostgreSQL

### Hosted on

Heroku and Vercel
