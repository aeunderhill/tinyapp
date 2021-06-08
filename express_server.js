const express = require("express");
const bodyParser = require("body-parser");

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



app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});



app.get("/urls/:shortURL", (req, res) => {
const shortURL = req.params.shortURL
const templateVars = { shortURL, longURL: urlDatabase[shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});