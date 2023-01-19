const bodyParser = require('body-parser');
var express = require('express')
var app = express()
let mysql = require('mysql');
let config = require('./config.js');

app.get('/',function(req,res) {
    res.json("Hi welcome")
})

app.get('/getUser', function(req,res) {

   let connection = mysql.createConnection(config);
   let sql = `SELECT * FROM edureka.user`;
   connection.query(sql, (error, results, fields) => {
       if (error) {
         res.json("1");
         return console.error(error.message);
       }
       else if(results.length>0)
       {
         res.json(results)
       }
       else
       {
         res.json("2");
       }
   });
   connection.end();
})


app.get('/addUser', function(req,res) {
    
    let todo = [req.query.firstname,req.query.lastname,req.query.email,req.query.password];
    
    let connection = mysql.createConnection(config);
  
    let stmt = `Insert into edureka.user(firstname, lastname, email, password)
                values(?,?,?,?)`;
  
    connection.query(stmt, todo, (err, results, fields) => {
      if (err) {
        res.json("0");
        return console.error(err.message);
        
      }
      res.json('Details are submitted')
    });
    connection.end();
});

app.get('/updatePassword', function(req,res) {

  let connection = mysql.createConnection(config);
  let sql = 'UPDATE edureka.user SET password= "' + req.query.password + '" WHERE email = "' + req.query.email + '";';
  connection.query(sql, (error, results, fields) => {
    if (error){
        res.json('Error')
        return console.error(error.message);
     }
  });
  res.json('Success')
  connection.end();
}) 
///////////////////////////////////////////////////////////////////////////////
var multer = require('multer');

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {

      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      console.log(filename)
      cb(null, file.fieldname + '-' + Date.now() + ".png")
  }

});

// Decliere Images Function
const upload = multer({ storage: multer.memoryStorage() });


app.get('/proficPic',upload.single('src'), function(req,res) {
  image = req.file
  name = req.params.src
  console.log(req.params.src)
  console.log(image)
  console.log(name)
  // let connection = mysql.createConnection(config);
  // let sql = 'UPDATE edureka.user SET profilepic= "' + req.query.src + '" WHERE firstname = "' + req.query.username + '";';
  // console.log(sql)
  // connection.query(sql, (error, results, fields) => {
  //   if (error){
  //       res.json('Error')
  //       return console.error(error.message);
  //    }
  // },(results) =>
  // {
  //   console.log(results)
  //   res.json('Success')
  // });
  // connection.end();
}) 

///////////////////////////////////////////////////////////////////////////////////////////////////



app.get('/getUserProfile', function(req,res) {

  let connection = mysql.createConnection(config);
  let sql = 'SELECT * FROM edureka.user where firstname= "' + req.query.name+'";';
  console.log(sql)
  connection.query(sql, (error, results, fields) => {
      if (error) {
        res.json("1");
        return console.error(error.message);
      }
      else if(results.length>0)
      {
       // results[0].profilepic=''
       var image = results[0].profilepic.buffer.toString('base64')
        console.log(results[0].profilepic)
        console.log(image)

        res.json(results)
      }
      else
      {
        res.json("2");
      }
  });
  connection.end();
})














////////////////////////      requestss & friendss    //////////////////////////

app.get('/getRequest', function(req,res) {
  let connection = mysql.createConnection(config);
  let sam = `select * from edureka.requests where request = "`+req.params.request+`";`;
  connection.query(sam, (error, results, fields) => {
    if (error) {
      res.json("0");
      return console.error(error.message);
    }
    else if(results.affectedRows>0)
    {
      res.json("1")
    }
    else
    {
      res.json("2");
    }
});
connection.end();
})

app.get('/addRequest', function(req,res) {
    
  let todo = [req.query.username,req.query.src,req.query.name,req.query.request];
  
  let connection = mysql.createConnection(config);

  let stmt = `Insert into edureka.requests(username, src, name, request)
              values(?,?,?,?)`;

  connection.query(stmt, todo, (err, results, fields) => {
    if (err) {
      res.json("0",err.message);
      return console.error(err.message);
      
    }
    res.json('Details are submitted')
  });
  connection.end();
});

app.get('/updateRequest', function(req,res) {
  let connection = mysql.createConnection(config);
  let sql = 'UPDATE edureka.requests SET request= "' + req.query.request + '" WHERE username = "' + req.query.username + '";';
  console.log(sql)
  connection.query(sql, (error, results, fields) => {
    if (error){
        res.json('Error')
        return console.error(error.message);
     }
  },(results) =>
  {
    res.json('Success')
  });
  connection.end();
})
////////////////////////      Postss    //////////////////////////

app.get('/getPosts', function(req,res) {
  let connection = mysql.createConnection(config);
  let sam = `select * from edureka.posts`;
  connection.query(sam, (error, results, fields) => {
    if (error) {
      res.json("0");
      return console.error(error.message);
    }
    else if(results.affectedRows>0)
    {
      res.json("1")
    }
    else
    {
      res.json("2");
    }
});
connection.end();
})

app.get('/addPost', function(req,res) {
    
  let todo = [req.query.username,req.query.src,req.query.date];
  
  let connection = mysql.createConnection(config);

  let stmt = `Insert into edureka.posts(username, src, date)
              values(?,?,?)`;

  connection.query(stmt, todo, (err, results, fields) => {
    if (err) {
      res.json("0",err.message);
      return console.error(err.message);
      
    }
    res.json('Details are submitted')
  });
  connection.end();
});

var moment = require('moment');
app.get('/attend', function(req,res) {
  today = moment().format('YYYY-MM-DD');
  let todo = [req.query.emp_id,today,req.query.val];
  let connection = mysql.createConnection(config);
  let sam = `Insert into edureka.attendence(emp_id, date, attend)values(?,?,?)`;
  connection.query(sam,todo, (error, results, fields) => {
    if (error){
      res.json("There is a error in your query")
      return console.error(error.message);
    }
    else if(results)
    {
      res.json(results);
    }
    else
    {
      res.json("1");
    }
  });
  connection.end();
})

app.listen(4000)