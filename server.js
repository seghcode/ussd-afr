const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express()
const PORT = process.env.PORT || 5000

// Models
const user = require('./model/User')

// using middleware
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// using morgan
app.use(morgan('dev'))

// mongoDB connection
mongoose.connect("mongodb://localhost:27017/ussd", {
  useNewUrlParser: true,
});
const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('connected', () => console.log('Database running'))

// ::::::
app.get('/', (req, res) => {
  res.send('Success')
})
app.post('/', (req, res) => {
  // console.log(req.body);
  const {
    phoneNumber,
    text,
    sessionId
  } = req.body;
  let response;

  if (text === '') {
    response = 'CON Enter your full name'
  }
  if (text !== '') {
    let array = text.split('*')
    if (array.length === 1) {
      response = 'CON Enter your id number'
    } else if (array.length === 2) {
      // ID NUMBER
      if (parseInt(array[1]) > 0) {
        response = 'CON Please confirm if you want to save your data \n1. Confirm \n2. Cancel'
      } else {
        response = 'END Network error, Please try again'
      }
    } else if (array.length === 3) {
      if (parseInt(array[2]) === 1) {
        let data = new user();
        data.fullname = array[0];
        data.id_number = array[1];

        data.save(() => {
          response = 'END Your data was saved successfully'
        })
      } else if (parseInt(array[2]) === 2) {
        response = 'END sorry, Data not saved.'
      } else {
        response = 'END invalid input.'
      }
    } else {
      response = 'END Network error, Please try again'
    }
  }

  setTimeout(() => {
    console.log(text);
    res.send(response);
    res.end()
  }, 2000);
})



app.listen(PORT, () => console.log(`server running on port ${PORT}`))