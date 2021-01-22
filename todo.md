# Registration page
## User story:


 List out all of the fetch request that are needed and what data needs to be sent back to make everything work. 


# Endpoints that are needed: 

# Location: CommunityDeck.js
Action: On community deck page, a user adds a new deck from community decks into a users personal decks.
`/language` POST request - it needs to add a new row to the language table with the user ID and the ID of the language
Needs: user ID, and language ID passed. 
Returns: 

# Location: CommunityDecksDashboard.js
Action: when the page loads a request needs to grab all community decks (currently that is all decks, I could add a is_public boolean colum later).
Fetch: `/language` GET request
Needs: Nothing
Returns: an Array of languages with { name, total_score } (it would be nice to somehow populate an emoji flag of the language or some image)

# Location: LanguageCard.js
Action: when the user clicks Delete card
Fetch:  `/word/:id` DELETE request
Needs: the id of the word card to be present
Returns: nothing

# Location: LanguageCard.js
Action: when the user clicks Edit card
Fetch: `/word/:id` PUT request
Needs: the id of the word card and the original and translation to be sent in the body
Returns: nothing

# Location: languageDeckDashboard.js - this already works but not correctly
Action: when loading the language-dashboard we need all of the words in a language
Fetch: `/language/:id` GET request
Needs: the id of the language deck to return 
Returns: an array of words related to the language deck id. AND an object of the language with the head, the id, the name, total_score, and user ID

# Location: languageDeckDashboard.js
Action: when a user clicks the delete button it removes a deck
Fetch: `/language/:id` DELETE request
Needs: the language id to be deleted. it also needs to CASCADE delete all of the words associated with the language ID. 
Returns: nothing

# Location: languageDeckDashboard.js
Action: when a user clicks add a new card
Fetch: `/word/:id` PUT request
Needs: the id of the word to relate the word with, the original and translation, and in the back end it needs to add the word to the next position in the linked list for that language, making it's next value null
Returns: nothing

# Location: MakeNewDeck.js
Action: when you submit the title of a new deck it needs to be added to the language table
Fetch: `/language` POST request
Needs: the user id to associate the language with. 
Returns: nothing

# Location: UserDecksDashboard.js
Action: a user loads the user dashboard and all of the users languages should be shown
Fetch: `/user/:id` GET request
Needs: id of the user
Returns: an array of objects that are the users languages

# Location: UserDeck.js
Action: when a user clicks the delete button it removes a deck
Fetch: `/language/:id` DELETE request
Needs: the language id to be deleted. it also needs to CASCADE delete all of the words associated with the language ID. 
Returns: nothing

# Location: UserDeck.js
Action: a user clicks the edit title button
Fetch: `/language/:id` PUT request to update the name of the language 
Needs: the id of the language 
Returns: nothing

# Location: 
Action:
Fetch: 
Needs: 
Returns: 

# Location: 
Action:
Fetch: 
Needs: 
Returns: 

# Location: 
Action:
Fetch: 
Needs: 
Returns: 




      .from('user_connections as a')
      .join('users as b', 'b.id', '=', 'a.user_id')
      .join('user_profile as c', 'b.id', '=', 'c.user_id')
      .select('*')
      .where('a.connection_id', id)
      .first();