const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();

const databaseName = "r-divide";

var posts = [];
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(`mongodb://localhost:27017/${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}); 

const userSchema = {
  username: String,
  password: String,
}

const User = mongoose.model("User", userSchema);

var Admin = { username: 'admin', password: 'password' }
User.insertMany(Admin);

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
  res.render('login',{ error: false
  });
});

app.post("/login", function (req, res) {
  var usernameInput = (req.body.username)
  var passwordInput = (req.body.password)
  MongoClient.connect(url, function (err, db) {
      var dataBase = db.db('r-divide');
      dataBase.collection('users').find().toArray(function (err, eee) {
          if (eee[0].username === usernameInput && eee[0].password === passwordInput) {
              res.redirect('/orders')
          } else {

              res.render('login', { error: true })
          }
      })
  })
})
app.get('/orders',function(req,res){
  res.render('orders',{
  });
});




app.listen(3000, function() {
    console.log("Server started on port 3000");
  });

