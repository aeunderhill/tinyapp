const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const cookieSession = require("cookie-session");
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080; // default port 8080

//Functions to be used://

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
    return bcrypt.compareSync(password, user.password)
  }

//node modules to be used://

app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"]
}));

app.use(cookieParser());
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));

//url and user databases//

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "dad" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "dad" }
};

const users = { 
  "randomID": {
    id: "randomID", 
    email: "dad@home.com", 
    password: bcrypt.hashSync("abc123", 10)
  },
  "randomID2": {
    id: "randomID2", 
    email: "mom@home.com", 
    password: bcrypt.hashSync("12345", 10)
  }
}

//making sure the port is open and listening//

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.redirect("/login");
});


//making a new URL//

app.get("/urls/new", (req, res) => {  
  let userId = req.session.user_ID;
  if(userId){
    let user = users[userId]
    let templateVars = { urls: urlDatabase, user }
    res.render("urls_new", templateVars);
  } else{
    res.redirect("/login")

  }
});

//posting a new shortURL//

app.post("/urls", (req, res) => {     
  const shortURL = generateRandomString() 
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session.user_ID};
  res.redirect("/urls");        
});

//getting URLs for each user

app.get("/urls", (req, res) => {  
    let user = users[req.session.user_ID];   
    let userId = req.session.user_ID;
    let user_email;
    if (users[userId]) {
      user_email = users[userId].email
      let templateVars = {urls: specificURLs(userId), user_email, user}
      res.render("urls_index", templateVars);
    } else {
      res.status(400).send("You are not logged in!")
    }
});

//letting users edit their own URLs

app.get("/urls/:shortURL", (req, res) => {  
  let user = users[req.session.user_ID]; 
  //let user = identifyUser(users[req.session.user_ID]);  
  let shortURL = req.params.shortURL;

  if (!user) {
    res.status(401).send("No access for you!");
  } else {
    let templateVars = {
      shortURL: shortURL,
      longURL: urlDatabase[shortURL].longURL,       
      user
    };
    res.render("urls_show", templateVars)
  }
});

//posting URLs based on userID

app.post("/urls/:id", (req, res) => { 
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL]

  if (longURL && longURL.userID === req.session.user_ID) {
    urlDatabase[shortURL.longURL] = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.redirect("/login")
  }      
});

//redirecting to longURL from newly made shortURL

app.get("/u/:shortURL", (req, res) => {         
  let shortURL = req.params.shortURL; 
  let longURL = urlDatabase[shortURL].longURL
  console.log(shortURL, longURL)
  res.redirect(longURL);
});

//allowing users to delete a URL

app.post("/urls/:shortURL/delete", (req, res) => { 
  let shortURL = req.params.shortURL;

  if (urlDatabase[shortURL].userID === req.session.user_ID) {
  delete urlDatabase[shortURL];
  res.redirect("/urls");
  } else {
    res.status(400).send("You don't have permission to delete")
  }
});

//storing cookie from a users login

app.get("/login", (req, res) => {  //done
  let user = identifyUser(users[req.session.user_ID])
  const templateVars = {
    user: users[req.session.user_ID] };

    if (user) {
      res.redirect("/urls")
    } else {
      res.render("login", templateVars )
    }
});

//checking to see if password and email are correct at login

app.post("/login", (req, res) => {  
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Please enter your email and password.")
  }

  let email = req.body.email;
  let password = req.body.password;            
  let user = successfulLogOn(email);
  
  let comparePass = bcrypt.compareSync(password, user.password)
  if (user && comparePass) {
    req.session.user_ID = user.id
    res.redirect("/urls");
  } else {
    res.status(403).send("Email or Password is incorrect.")
  }
});

//logout and deletes cookies//

app.post("/logout", (req, res) => {  
  req.session = null 
  res.redirect("/login");
});

//newly registered users//

app.get("/register", (req, res) => {  
  let user = identifyUser(users[req.session.user_ID])
  let templateVars = { urls: urlDatabase, user: req.session.user_ID }
    res.render("register", templateVars)
});


//generates cookie for new user/stored in user database//

app.post("/register", (req, res) => {  
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).send("Please enter your email and password.")

  } else if (!isEmailAvail(email, users)) {
    res.status(400).send("This email is being used by someone else!")
  } else {

  let randomID = generateRandomString();
  users[randomID] = {
    id: randomID,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  req.session.user_ID = randomID
  res.redirect("/urls");  
  }
});