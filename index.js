const express = require('express');
const Enmap = require("enmap")
require("dotenv").config();
const app = express();
const bodyParser = require('body-parser'); app.use(bodyParser.json()); 

const DB = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
    autoEnsure: {
        Whitelist: []
      },
    dataDir: `${process.cwd()}/DataBase`
  });

  //btoa()
DB.ensure("USP")
app.get('/api/check', (req, res) => {
    const UserId = req.body.user;
    const data = DB.get("USP")
    const IsWhitelisted = data.Whitelist.includes(UserId)
     let answer = {
        ID: UserId,
        Whitelisted: IsWhitelisted
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(answer));
});

app.post('/api/whitelist', (req, res) => {
  const body = req.body
  // console.log(body)
    const UserId = body["user"];
    const key = body["code"];
    const mode = body["type"]
    if(key != process.env.KEY) return;
    const data = DB.get("USP")
    var answer = {}
    switch(mode) {
      case "add":
        if(!data.Whitelist.includes(UserId)) {
          DB.push("USP", UserId, "Whitelist")
          answer = {
            message: "User has been whitelisted"
        }
      } else { answer = {message: "User is already whitelisted."}}
      break;
      case "remove":
        if(data.Whitelist.includes(UserId)) {
          DB.remove("USP", UserId, "Whitelist")
          answer = {
            message: "User whitelist has been removed."
        }
      } else { answer = {message: "User is not whitelisted."}}
      break;
      default:
      answer = { message: "Invalid Type." }
    }
res.setHeader('Content-Type', 'application/json');
res.end(JSON.stringify(answer));
});

app.listen(3000, () => {
  console.log('Server started.');
});
