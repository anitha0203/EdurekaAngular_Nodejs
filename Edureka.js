const bodyParser = require('body-parser');
var express = require('express')
var app = express()
let mysql = require('mysql');
let config = require('./config.js');
var fs = require('fs')
var moment = require('moment');

app.get('/',function(req,res) {
    res.json("Hi welcome")
})

///////////////////////////////         login     ////////////////////////
app.get('/getUser', function(req,res) {

    let connection = mysql.createConnection(config);
    let sql = `SELECT * FROM edureka.user`;
    connection.query(sql, (error, results, fields) => {
        if (error) {
          res.json("1");
          return;
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
 });

///////////////////////////////         register     ////////////////////////
 app.get('/addUser', function(req,res) {
    
    let todo = [req.query.firstname,req.query.lastname,req.query.email,req.query.password];
    let connection = mysql.createConnection(config);
    let stmt = `Insert into edureka.user(firstname, lastname, email, password) values(?,?,?,?)`;
    connection.query(stmt, todo, (err, results, fields) => {
      if (err) {
        res.json("0");
        return console.error(err.message);  
      }
      res.json('Details are submitted')
    });
    connection.end();
});

///////////////////////////////         reset password     ////////////////////////
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
});

///////////////////////////////         profilepic     ////////////////////////
var multer = require('multer');

const Storage = multer.diskStorage({
  destination: (req, file, callBack) => {

    callBack(null, 'uploads')
  },
  filename: (req, file, callBack) => {
      callBack(null,file.originalname)
  }

});
const upload = multer({ storage: Storage });

app.post('/file',upload.single('file'), function(req,res,next) {

    const file = req.file
     if(!file){
         const error = new Error('No file')
         res.json(error)
         return
     }
     var dataaa = "data:image/gif;base64,"+fs.readFileSync(file.path, 'base64');
     res.send(file)
     let connection = mysql.createConnection(config);
     let sql = 'UPDATE edureka.user SET profilepic= "' + dataaa + '" WHERE firstname = "' + req.body.username + '";';
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

///////////////////////////////         singleUser     ////////////////////////
app.get('/getUserProfile', function(req,res) {
    let connection = mysql.createConnection(config);
    let sql = 'SELECT * FROM edureka.user where firstname= "' + req.query.name+'";';
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
});

///////////////////////////////         postdata     ////////////////////////
app.get('/getPosts', function(req,res) {
    let connection = mysql.createConnection(config);
    let sql = 'SELECT * FROM edureka.posts where username= "' + req.query.username+'";';
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
});

///////////////////////////////         postPics     ////////////////////////
app.post('/file2',upload.single('file'), function(req,res,next) {
    const file = req.file
     if(!file){
         const error = new Error('No file')
         res.json(error)
         return
     }
     var dataaa = "data:image/gif;base64,"+fs.readFileSync(file.path, 'base64');
     res.send(file)
     let connection = mysql.createConnection(config);
     today = moment().format('YYYY-MM-DD');
     let todo = [req.body.username,dataaa,today]
     let sql = 'insert into edureka.posts(username,src,date) values(?,?,?);';
 
     connection.query(sql,todo, (error, results, fields) => {
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

 ///////////////////////////////         requestdata     ////////////////////////
app.get('/getRequest', function(req,res) {
    let connection = mysql.createConnection(config);
    let sql = 'SELECT * FROM edureka.requests where username= "' + req.query.username+'" and request='+req.query.request;
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
});

///////////////////////////////         setting     ////////////////////////
app.get('/setting', function(req,res,next) {
    let connection = mysql.createConnection(config);
    let sql = 'UPDATE edureka.user SET lastname= "' + req.query.lastname+'", email= "'+req.query.email + '" WHERE firstname = "' + req.query.firstname + '";';
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

 ///////////////////////////////         delete user     ////////////////////////
app.get('/delete', function(req,res) {
    let connection = mysql.createConnection(config);
    let sql = 'DELETE FROM edureka.user where firstname= "' + req.query.username+'";';
    let sql2 = 'DELETE FROM edureka.posts where username= "' + req.query.username+'";';
    let sql3 = 'DELETE FROM edureka.requests where username= "' + req.query.username+'";';
    connection.query(sql2, (error, results, fields) => {
        if (error) {
          res.json("1");
          return console.error(error.message);
        }
    });
    connection.query(sql3, (error, results, fields) => {
        if (error) {
          res.json("1");
          return console.error(error.message);
        }
    });    
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
});

app.listen(4000)