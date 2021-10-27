const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express()
const PORT = process.env.PORT || 5000

// using middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

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
app.get('/',(req, res) => {
    res.send('Success')
})



app.listen(PORT,()=> console.log(`server running on port ${PORT}`))