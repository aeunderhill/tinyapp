const getUserByEmail = function(email, database) {
  for (let userID in database) {
    if(database[userID].email === email) {
      return database[userID]
    }
  }
};