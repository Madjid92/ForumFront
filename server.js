const express = require('express');
const path = require('path');
const fs = require("fs");
const mustache = require('mustache')

const app = express();
const port = process.env.PORT || 8000;
const BACK_IP_ADDS = "192.168.237.11:3000";
app.use(express.static('./public'));
// sendFile will go here
app.get('/', function(req, res) {
  const template= fs.readFileSync(path.join(__dirname, '/public/chat.html'), "utf8");
  const html = mustache.render(template, {ipAddress : BACK_IP_ADDS});
  res.status(200).send(html)
});


app.get('/login', function(_, res) {
  const template= fs.readFileSync(path.join(__dirname, '/public/login.html'), "utf8");
  const html = mustache.render(template, {ipAddress : BACK_IP_ADDS});
  res.status(200).send(html)
});




app.listen(port, () =>{
  console.log('Server started at http://localhost:' + port);
});
