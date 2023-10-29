const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: 'testtest',
  database: 'tukuttekun'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
  connection.query(
    'select * from reizouko order by date asc',(error,results)=>{
      console.log(results);
      res.render('index.ejs',{items:results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  console.log(req.body.itemName);
  console.log(req.body.itemDate);
  connection.query(
    'INSERT INTO reizouko (name,date) VALUES (?,?)',
    [req.body.itemName,req.body.itemDate],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.listen(3000, ()=>{
  console.log('start');
});