const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
var posts = [];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/',function(req,res){
  res.render('home',{
  });
});
app.get('/booking',function(req,res){
  res.render('booking',{
  });
});
app.get('/category',function(req,res){
  res.render('category',{
  });
});
app.get('/checkout',function(req,res){
  res.render('checkout',{
  });
});
app.get('/login',function(req,res){
  res.render('login',{
  });
});
app.get('/account',function(req,res){
  res.render('account',{
  });
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });

