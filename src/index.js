if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}


// Importing libraries that we installed using npm

const passport = require("passport");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const initializepassport = require("../passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");


initializepassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = [];

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const { response } = require("express");
app.use(bodyParser.json())




// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: 'secretidhere',
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))
//setting view engine to ejs
app.set("view engine", "ejs");

app.use(express.static('public'))

app.get('/', checkNotAuthenticated, (req, res) => {
  res.render('index');
});

// ======================== my sql database connection=============================

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "cv maker"
});
con.connect(function (err) {
  if (err) throw err;
  console.log(" successfully Connected!");
});

// login 

app.get('/login',checkNotAuthenticated,(req, res) => {
  res.render('login')
});

app.get('/register', checkNotAuthenticated, (req, res) =>{
  res.render('register')
});
//  Sign up system

//  Configuring the login post functionality

app.post("/login",checkNotAuthenticated,passport.authenticate("local",{
  successRedirect: "/Home",
  failureRedirect: "/login",
  failureFlash: true
}))

// Configuring the register post functionality
app.post("/register",checkNotAuthenticated,async(req,res) =>
{
  try{
    const hashedPassword = await bcrypt.hash(req.body.password,10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    })
console.log(users);//Display newly registered in the console

    res.redirect("/login")
  }catch(e){
    console.log(e);
res.redirect("/register")
  }
  })

//  logout your account
  app.delete("/logout",(req,res) =>{
    req.logout(req.user,err => {
      if (err) return next(err)
      res.redirect("/register")
    })
  })

  function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/Home")
    }
    next()
}

app.get('/Home', function (req, res) {
  res.render('deshboard')
});
//  Templates

app.get('/Home-template-1', function (req, res) {
  res.render('template/template1')
});
app.get('/Home-template-1-exp',function (req, res){
  res.render('template/template1-exp')
}); 

app.get('/Home-template-1-edu',function (req, res){
  res.render('template/template1-edu')
}); 
app.get('/Home-template-1-skil',function (req, res){
  res.render('template/template1-skil')
}); 
app.listen(3005, function () {
  console.log("Server is running on port 3005");
});