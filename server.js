var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
console.log("asd");
app.use(express.static(__dirname + '/public'));
app.listen(port);