require('dotenv').config()
const express = require('express'),
      session = require('express-session'),
      massive = require('massive'),
      // authCtrl = require('./controllers/authController'),
      // path = require('path'),
      // setup = require('./controllers/setup'),
      {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env,
      app = express();


app.use(express.static(`${__dirname}/../build`)); // note need this to do yarn run build for digitalOcean

app.use(express.json())
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 31}, // good for one month
  })
)

massive({
  connectionString: CONNECTION_STRING,
  ssl: {rejectUnauthorized: false}
}).then(db => {
  app.set('db', db)
  console.log('db connected')
  app.listen(SERVER_PORT, () => console.log(`server is running on port ${SERVER_PORT}`))
}).catch(err => console.log('err starting db', err))