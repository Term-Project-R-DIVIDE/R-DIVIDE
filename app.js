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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(`mongodb://localhost:27017/${databaseName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = {
  username: String,
  password: String,
}
const tableSchema = {
  tableNumber: String,
  order: Object,
}
const menuSchema = {
  id: Number,
  name: String,
  prize: Number,
  image: String,
  request: String,
  status: String,
}


const User = mongoose.model("User", userSchema);
const Table = mongoose.model("Table", tableSchema);
const Maindish = mongoose.model("maindish", menuSchema);
const Appetizer = mongoose.model("appitizer", menuSchema);
const Drink = mongoose.model("drink", menuSchema);
const Dessert = mongoose.model("dessert", menuSchema);
var Admin = { username: 'admin', password: 'password' }
User.insertMany(Admin);

const maindish = [
  {
      id: 0,
      name: "seafood-pizza",
      prize: "199",
      image: "/Pictures/category/main-dish/seafood-cocktail-pizza.jpg",
      request: '',
      status: '',
  },
  {
      id: 1,
      name: "double-cheese-pizza",
      prize: "199",
      image: "/Pictures/category/main-dish/double-cheese-pizza.jpg",
      request: '',
      status: '',
  },
  {
      id: 2,
      name: "meat-deluxe-pizza",
      prize: "199",
      image: "/Pictures/category/main-dish/meat-deluxe-pizza.jpg",
      request: '',
      status: '',
  },
  {
      id: 3,
      name: "sausage-spaghetti",
      prize: "129",
      image: "/Pictures/category/main-dish/sausage-spaghetti.jpg",
      request: '',
      status: '',
  },
  {
      id: 4,
      name: "drunken-spaghetti",
      prize: "100",
      image: "/Pictures/category/main-dish/drunken-spaghetti.jpg",
      request: '',
      status: '',
  },

]
const appetizer = [
  {
      id: 0,
      name: "bread-stick",
      prize: "89",
      image: "/Pictures/category/appetizer/bread-stick.jpg",
      request: '',
      status: '',
  },
  {
      id: 1,
      name: "chicken-pop",
      prize: "89",
      image: "/Pictures/category/appetizer/chicken-pop.jpg",
      request: '',
      status: '',
  },
  {
      id: 2,
      name: "fish-donut",
      prize: "89",
      image: "/Pictures/category/appetizer/fish-donut.jpg",
      request: '',
      status: '',
  },
  {
      id: 3,
      name: "garlic-bread",
      prize: "89",
      image: "/Pictures/category/appetizer/garlic-bread.jpg",
      request: '',
      status: '',
  },
  {
      id: 4,
      name: "salad",
      prize: "119",
      image: "/Pictures/category/appetizer/salad.jpg",
      request: '',
      status: '',
  }
]
const drink = [
  {
      id: 0,
      name: "water",
      prize: "19",
      image: "/Pictures/category/drink/drinking-water.jpg",
      request: '',
      status: '',
  },
  {
      id: 1,
      name: "cola",
      prize: "29",
      image: "/Pictures/category/drink/cola.jpg",
      request: '',
      status: '',
  },
  {
      id: 2,
      name: "lemon-tea",
      prize: "49",
      image: "/Pictures/category/main-dish/lemon-tea.jpg",
      request: '',
      status: '',
  },
  {
      id: 3,
      name: "beer",
      prize: "79",
      image: "/Pictures/category/main-dish/beer.jpg",
      request: '',
      status: '',
  }
]
const dessert = [
  {
      id: 0,
      name: "donut",
      prize: "39",
      image: "/Pictures/category/dessert/donut.jpg",
      request: '',
      status: '',
  },
  {
      id: 1,
      name: "croissant",
      prize: "89",
      image: "/Pictures/category/dessert/croissant.jpeg",
      request: '',
      status: '',
  },
  {
      id: 2,
      name: "chocolate-roll",
      prize: "109",
      image: "/Pictures/category/main-dish/dessert/chocolate-roll.jpeg",
      request: '',
      status: '',
  },
  {
      id: 3,
      name: "chocolate-muffin",
      prize: "99",
      image: "/Pictures/category/dessert/chocolate-roll.jpg",
      request: '',
      status: '',
  }
]
for (i = 0; i < maindish.length; i++) {
  Maindish.insertMany(maindish[i]);
  Appetizer.insertMany(appetizer[i]);
  Drink.insertMany(drink[i]);
  Dessert.insertMany(dessert[i]);
}

app.get('/', function (req, res) {
  res.render('home', {
  });
});
app.get('/booking', function (req, res) {
  res.render('booking', {
  });

});
app.get('/category', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var dataBase = db.db('r-divide');
    dataBase.collection('tables').find({ tableNumber: selectedTable }).toArray(function (err, eee) {
        var totalPrice = 0;
        for (i = 1; i < eee[0].order.length; i++) {
            totalPrice += eee[0].order[i].prize;
        }

        res.render('category', {
            mainListItems: maindish,
            bevListItems: drink,
            desListItems: dessert,
            appListItems: appetizer,
            orderLists: eee[0].order,
            totalP: totalPrice,
            found: {},
            tableNumber: selectedTable,
        })
    })

})
});
app.get('/checkout', function (req, res) {
  res.render('checkout', {
  });
});
app.get('/login', function (req, res) {
  res.render('login', {
    error: false
  });
});

var selectedTable = 0;
app.post('/table', function (req, res) {
    selectedTable = (req.body.tableNB)
    console.log(selectedTable);
    res.redirect('/category');
})

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
app.get('/orders', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var dataBase = db.db('r-divide');
    dataBase.collection('tables').find().toArray(function (err, eee) {

      res.render('orders', {
        tableLists: eee,
      });
    })
  })


});


app.post('/refresh', function (req, res) {
  res.redirect('/orders')
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

