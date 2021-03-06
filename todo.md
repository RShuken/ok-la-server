# Registration page
## User story:


 List out all of the fetch request that are needed and what data needs to be sent back to make everything work. 


# Endpoints that are needed: 

# Location: CommunityDeck.js  DONE
Action: On community deck page, a user adds a new deck from community decks into a users personal decks.
`/language` POST request - it needs to add a new row to the language table with the user ID and the ID of the language
Needs: user ID, and language ID passed. 
Returns: 

# Location: CommunityDecksDashboard.js DONE
Action: when the page loads a request needs to grab all community decks (currently that is all decks, I could add a is_public boolean colum later).
Fetch: `/language` GET request
Needs: Nothing
Returns: an Array of languages with { name, total_score } (it would be nice to somehow populate an emoji flag of the language or some image)

# Location: LanguageCard.js DONE
Action: when the user clicks Delete card
Fetch:  `/word/:id` DELETE request
Needs: the id of the word card to be present
Returns: nothing

# Location: LanguageCard.js DONE
Action: when the user clicks Edit card
Fetch: `/word/:id` PUT request
Needs: the id of the word card and the original and translation to be sent in the body
Returns: nothing

# Location: languageDeckDashboard.js - DONE
Action: when loading the language-dashboard we need all of the words in a language
Fetch: `/language/:id` GET request
Needs: the id of the language deck to return 
Returns: an array of words related to the language deck id. AND an object of the language with the head, the id, the name, total_score, and user ID

# Location: languageDeckDashboard.js DONE
Action: when a user clicks the delete button it removes a deck
Fetch: `/language/:id` DELETE request
Needs: the language id to be deleted. it also needs to CASCADE delete all of the words associated with the language ID. 
Returns: nothing

# Location: languageDeckDashboard.js DONE
Action: when a user clicks add a new card
Fetch: `/word/:id` PUT request
Needs: the id of the word to relate the word with, the original and translation, and in the back end it needs to add the word to the next position in the linked list for that language, making it's next value null
Returns: nothing

# Location: MakeNewDeck.js  DONE
Action: when you submit the title of a new deck it needs to be added to the language table
Fetch: `/language` POST request
Needs: the user id to associate the language with. 
Returns: nothing

# Location: UserDecksDashboard.js DONE
Action: a user loads the user dashboard and all of the users languages should be shown
Fetch: `/user/:id` GET request
Needs: id of the user
Returns: an array of objects that are the users languages

# Location: UserDeck.js DONE
Action: when a user clicks the delete button it removes a deck
Fetch: `/language/:id` DELETE request
Needs: the language id to be deleted. it also needs to CASCADE delete all of the words associated with the language ID. 
Returns: nothing

# Location: UserDeck.js DONE 
Action: a user clicks the edit title button
Fetch: `/language/:id` PUT request to update the name of the language 
Needs: the id of the language 
Returns: nothing

`template below do not edit`
# Location: 
Action:
Fetch: 
Needs: 
Returns: 

# Issue: 
Location: 
User Action: 
Fetch: 
Requires: 
Returns: 
Solutions: 

# New To Do

# Issue: When creating a new language the head value is null, then when adding a new card, the head value is still null DONE
Location: language-router / language-services
User Action: after a user adds a new language a user adds the first word in the language.
Fetch: `/language/:id/word` POST or `/language POST`
Requires:  Language name, user id
Returns: the new language added. 
Solutions: Every new language deck created will come with a default card that sets the head value. Have a function check when adding a new word if it's the first word being added, to then go back and set it's value to the head of the language. (this might be best)

# Issue: front end crashes after adding the first word to a new language DONE
Location: langaugeDeckDashboard.js
User Action: after user adds first word to a new deck
Fetch: `/language/:id/word` POST 
Requires: language ID, original and translation
Returns: 
Solutions: maybe fix with component did update?

These two might be related!!!!

# Issue: Cannot read property 'id' of undefined at Object.addNewWord (C:\Users\ryans\Documents\Thinkful\server ok language learning\src\language\language-service.js:100:29)   DONE
Location:  language-service
User Action: when adding the first card to a new deck. 
Fetch: 
Requires: 
Returns: 
Solutions: 

# Issue: fix the total-score in the language-router, it's hard coded to 10 and is not updating from the real data call. DONE
Location: language-router and language-services
User Action: when a user is guessing correct or incorrect answers the score is wrong in the /guess request
Fetch: /guess PUT
Requires: the user guess, 
Returns: 
Solutions: write a new database call to get the correct total score

# Issue: No feedback for the user after they add a deck from the community, need a way to show that a deck is already part of a users library  DONE 
Location: 
User Action: 
Fetch: 
Requires: 
Returns: 
Solutions: a front end solution that removes decks that have been clicked to be added. 

# Issue: The language table needs a 'is_public' colum that is default to false, so after adding a new deck it does not further populate the community deck list over and over.  DONE
Location: 
User Action: 
Fetch: 
Requires: 
Returns: 
Solutions: 


# New tickets

# Issue:  DONE
Location: language router / language services and client side, user deck card.
User Action: user needs to be able to click a small box to toggle is public
Fetch: /language/:id PUT
Requires: 
Returns: 
Solutions: make fetch request, and service object then wire up. 

# Issue: Need to check to make sure I have unhappy paths
Location: 
User Action: 
Fetch: 
Requires: 
Returns: 
Solutions: 

# Testing endpoints todo: 

`template`
Endpoint: ``
Type: 
Requires: 
Returns: 
---------------------------------

Status: `DONE`
Endpoint: `api/language/:id/title`
Type: PUT
Requires: { name: name }
Returns: 202 ok

Status: `DONE`
Endpoint: `api/language/:id`
Type: DELETE
Requires: nothing
Returns: 200

Status: `DONE`
Endpoint: `api/language/:id/word`
Type: POST
Requires: { original: word, translation: word}
Returns: 201

Status: `DONE`
Endpoint: `api/language/word/:wordId`
Type: PUT
Requires:  { original: word, translation: word}
Returns: 202

Status: `DONE`
Endpoint: `api/language/word/:wordId`
Type: DELETE
Requires: nothing
Returns: 200

Status: `DONE`
Endpoint: `api/language/:id/head`
Type: GET
Requires: nothing
Returns: {
      nextWord: nextWord.original,
      totalScore: req.languages.total_score,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
    }, 200

Status: `DONE`
Endpoint: `api/language/:id/guess`
Type: POST
Requires: { guess: guess }
Returns: 202, {
        nextWord: list.head.value.original,
        totalScore: languageObj.total_score,
        wordCorrectCount: list.head.value.correct_count,
        wordIncorrectCount: list.head.value.incorrect_count,
        answer: temp.value.translation,
        isCorrect: false,
      }


# Style to do

# Wave Errors

Error: `Contrast error or an empty button`  DONE 
Location:  userDeck.js

Error: `no script element is present` DONE 
Location: index.js

Error: `LanguageDeckDashboard.js:38 GET http://localhost:8000/api/language/undefined 500 (Internal Server Error` DONE

Issue: 320px on learning page style fix  DONE
# To Do :

1. Client side smoke test DONE
2. Finish server side endpoint test DONE
3. Readme for server
4. Readme for Client
5. landing page for client  DONE 
6. deploy client to vercel DONE
7. deploy server to heroku DONE
8. update github about section for each 


# Final Requirements 

Your app must do something interesting or useful

Your app must be a fullstack app using React, CSS, Node, Express, and PostgreSQL.

The client and API should be deployed separately and stored in separate GitHub repos.

Both client- and server-side code must be tested.
At a minimum, you should test the happy path for each endpoint in your API and include a smoke test for each component in your React client. If time permits, include tests for the unhappy paths for each endpoint and add snapshot tests for your client where appropriate.

Your app must be responsive and work just as well on mobile devices as it does on desktop devices.

All code must be high quality, error-free, commented as necessary, and clean. When a hiring manager looks at your code, you want them to think, "This person has great coding habits". There should be no errors in the console.

The styling on your client must be polished. That means choosing fonts and colors that make sense, correctly sizing different components, and ensuring that it looks great on both mobile and desktop devices.

The content of your app must be clear and readable.

You must use vanilla CSS for styling capstones. Frameworks like Bootstrap are not permitted. We've found that employers prefer to see candidates who demonstrate a true understanding of CSS.

You must have comprehensive README files for both GitHub repos (we'll discuss this step in detail at the end of this module).

Your app must have a landing page that explains what the app does and how to get started, in addition to pages required to deliver the main functionality.

You must deploy a live, publicly-accessible version of your app.

Your app must live at a custom URL and include a Favicon (we'll cover this later in the module).

Your app must work across different browsers (Chrome, Firefox, and Safari at a minimum)

If you choose to include an authentication system in your app, you must set up a demo user account and indicate on the landing page how to use it.