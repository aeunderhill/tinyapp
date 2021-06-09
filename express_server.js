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


app.use(cookieParser());
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "randomID": {
    id: "dad", 
    email: "dad@home.com", 
    password: "abc"
  },
  "randomID": {
    id: "mom", 
    email: "mom@home.com", 
    password: "123"
  }
}


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase,
    user: users[req.cookies["User_ID"]] }; //could be the problem
    console.log(templateVars)
  res.render("urls_index", templateVars);
});



app.get("/urls/:shortURL", (req, res) => {
const shortURL = req.params.shortURL
const templateVars = { shortURL,
   longURL: urlDatabase[shortURL],
   user: users[req.cookies["user_ID"]] };  //could be the problem
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

app.post("/login", (req, res) => {
  res.cookie('user_ID') //another possible problem
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_ID') //another possible problem
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = { 
    user: users[req.cookies["user_ID"]] 
  };
    res.render("register", templateVars);;
});

app.post("/register", (req, res) => {
  let randomID  = generaterandomString();
  users[randomID] = {
    id: randomID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('user_ID', randomID);
  res.redirect("/urls");        
});