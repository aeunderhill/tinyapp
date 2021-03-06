const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", users)
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput, "There do not match")
  });

  it('this user cannot be found', function() {
    const user = getUserByEmail("idont@exist.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput, "not found")
  })
});