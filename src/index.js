const express = require("express"),
  app = express();

  const dotenv = require('dotenv');
const mongoose = require('mongoose')



dotenv.config();
 

mongoose.set('strictQuery', false);
const User = require('../model/user')
mongoose.connect('mongodb://localhost:27017/login-app-db',{
useNewUrlparser: true,
useUnifiedTopology: true
// useCreateIndex: true,
// useFindAndModify: false 
}
)

  
  var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var bcrypt = require('bcryptjs');
const { response } = require("express");
app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//setting view engine to ejs
app.set("view engine", "ejs");

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.render('index');
});

// ============================================================================
// ============================================================================
// ======================== my sql database connection=============================

// var mysql = require('mysql');  
// var con = mysql.createConnection({  
//   host: "localhost",  
//   user: "root",  
//   password: "12345678",  
//   database: "cv maker"
// });  
// con.connect(function(err) {  
//   if (err) throw err;  
//   console.log("Connected!");  
// });  

// login 

app.get('/login', function (req, res) {
  res.render('login')
});

//  login system
// app.post('/userLogin', urlencodedParser, function (req, res, next) {
//   var email = req.body.email;
//   var password = req.body.password;

//   if (email == "vipin@1.com" && password == "1234") {
//     res.render('deshboard');
//   } else {
//     res.send("invalidcred")
//   }
// });

//  End of login system//

app.get('/signUp',function(req,res){
  res.render('signUp')
});
//  Sign up system
// app.post('/userSignUp', urlencodedParser, function (req, res, next) {
//   var email = req.body.email;
//   var password = req.body.password;

//   if (email == "vipin@12.com" && password == "12345") {
//     res.render('deshboard');
//   } else {
//     res.send("invalidcred")
//   }
// });


// mongoose registeration




app.post('/api/register',async (req,res)=>{
console.log(req.body)

//  analysts
// Scripts reading database
const {username,password:plaintextPassword} = req.body

if(!username || typeof username !== 'string')
{
  return res.json({status:'error',error:'Invalid username'})
}
if(!plaintextPassword || typeof plaintextPassword !== 'string')
{
  return res.json({status:'error',error:'Invalid password'})
}
if(plaintextPassword.lenght < 5){
  return res.json
  ({status:'error',
  error:' password  too small ,should be atleast 6 characters'})
}
console.log(await bcrypt.hash(plaintextPassword,10))
//  cook->developer
// Salt,Pepper,Oil,Vegetables -> Password
// (...,....,....,Salt,Pepper,Oil,Vegetables) -> Food
// bcrypt,md5,sha1,sha256,sha12...
 try{
   const response =  await User.Create({
  username,
  password
 })
 console.log('User created Successgully: ', response)
 }
 catch(error){
  // console.log(JSON.stringify(error.message))
  if(error.code === 11000)
  // duplicate key
  return res.json({status:'error',error : 'UserName Already in use'})
 }
 throw error 
// 1.The collision should be importable
// 2.The Algorithm Should be slow..

// The Special_function(password) -> fgyu654567890-=uytfvb8767890-ytg65789

// HAsing the password
res.json({status:'ok'})
})

//  End of Sign up system//

//  Templates

app.get('/deshboard-template', function (req, res) {
  res.render('template/template1')
});


app.listen(3002, function () {
  console.log("Server is running on port 3002");
});