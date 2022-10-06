const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./config/database')

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/public', express.static('public'));

db.connect((err) => {
  if (err) throw err;
  console.log('Mysql connected!');
});

const studentRoute = require('./routes/students/index');
app.use(studentRoute)

app.listen(3333);