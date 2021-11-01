const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express()
const PORT = process.env.PORT || 5000

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
    } 
      else if (array.length > 1) {
      // ID NUMBER
      if (parseInt(array[1]) > 0) {
        response = `END your full name ${array[0]}
        Your id number is ${array[1]}`
      } else {
        response = 'END Network error, Please try againnnn'
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