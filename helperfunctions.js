function generateRandomString() {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return randomString;
}

const isEmailAvail = (newEmail, users) => {
  for (let user in users) {
    if (users[user].email === newEmail) {
      return false;
    }
  }
  return true;
}

const identifyUser = function(id) {
  if (users[id]) {
    return users[id];
  }
}

const successfulLogOn = function(email) {
  let userID=null;
  for (let key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }
  return userID;
}

let specificURLs = function(id) {
  let userURLs = {};
  for (let url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      userURLs[url] = urlDatabase[url];
    }
  }
  return userURLs;
}

function checkPassword(user, password) {
  let hashPassword = bcrypt.hashSync(password, 10)
  console.log(user)
  return bcrypt.compareSync(password, user.password)
}

module.exports = { generateRandomString,
                  isEmailAvail,
                  identifyUser,
                  successfulLogOn,
                  specificURLs,
                  checkPassword }

                  