const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;
app.use(express.static('./public'));
// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/chat.html'));
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/login.html'));
});




app.listen(port, () =>{
  console.log('Server started at http://localhost:' + port);
});
