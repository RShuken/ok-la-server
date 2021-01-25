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

# Issue:  Add a make public click box that changes the langauge table value of is_public to true of false.  NOT DONE FULLY - router and services done, issue with client value not working located in  languageDeckDashboard
Location: language router / langauge services and client side, user deck card.
User Action: user needs to be able to click a small box to toggle is public
Fetch: /language/:id PUT
Requires: 
Returns: 
Solutions: make fetch request, and service object then wire up. 

# Issue:  Server endpoint testing happy and sad paths
Location: 
User Action: 
Fetch: 
Requires: 
Returns: 
Solutions: 

# Issue: Server testing for all CRUDS with fixtures
Location: 
User Action: 
Fetch: 
Requires: 
Returns: 
Solutions: 

# Issue: 
Location: 
User Action: 
Fetch: 
Requires: 
Returns: 
Solutions: 

# Issue: 
Location: 
User Action: 
Fetch: 
Requires: 
Returns: 
Solutions: 
