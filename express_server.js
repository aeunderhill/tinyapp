const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const app = express();
const PORT = 8080; // default port 8080

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
    return users[id]
  }
}

const successfulLogOn = function(email, password) {
  let userID=null;
  for (let key in users) {
    if ((users[key].email === email) && (users[key].password === password)) {
      return key;
    }
  }
  return userID;
}


app.use(cookieParser());
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));


const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "dad" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "dad" }
};

const users = { 
  "randomID": {
    id: "dad", 
    email: "dad@home.com", 
    password: "abc"
  },
  "randomID2": {
    id: "mom", 
    email: "mom@home.com", 
    password: "123"
  }
}


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//new url page

app.get("/urls/new", (req, res) => {
  //let user = identifyUser(users[req.cookies["user_ID"]]);
  let userId = req.cookies["user_ID"];
  if(userId){
    let user = users[userId]
    let templateVars = { urls: urlDatabase, user }
    res.render("urls_new", templateVars);
  } else{
    res.redirect("/login")

  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase,
    user: users[req.cookies["user_ID"]] }; //could be the problem
    console.log(templateVars)
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
const shortURL = req.params.shortURL
const templateVars = { shortURL,
   longURL: urlDatabase[shortURL],
   user: users[req.cookies["user_ID"]] };  
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL  = req.body.longURL;
  const shortURL = generateRandomString() 
  urlDatabase[shortURL] = longURL
  res.redirect(`/urls`);        
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL
  let longURL = urlDatabase[shortURL]
  res.redirect(longURL);;
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//login

app.get("/login", (req, res) => {
  let user = identifyUser(users[req.cookies["user_ID"]])
  const templateVars = {
    user: users[req.cookies["user_ID"]] };

    if (user) {
      res.redirect("/urls")
    } else {
      res.render("login", templateVars )
    }
});

app.post("/login", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Please enter your email and password.")
    //return;
  }

  let email = req.body.email;
  let password = req.body.password;
  let userId = successfulLogOn(email, password);

  if (userId) {
    res.cookie('user_ID', userId)
    res.redirect("/urls");
  } else {
    res.status(403).send("Email or Password is incorrect.")
    //res.redirect(`/urls`) //could be wrong
  }
});

//logout

app.post("/logout", (req, res) => {
  res.clearCookie('user_ID') 
  res.redirect("/urls");
});

//register

app.get("/register", (req, res) => {
  const templateVars = { 
    user: users[req.cookies["user_ID"]] 
  };
    res.render("register", templateVars);;
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).send("Please enter your email and password.")
    return

  } else if (!isEmailAvail(email, users)) {
    res.status(400).send("This email is being used by someone else!")
    return

  } else {
  
  let randomID  = generaterandomString();
  users[randomID] = {
    id: randomID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('user_ID', randomID);
  res.redirect("/urls");  
  }
});