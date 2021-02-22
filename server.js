require('dotenv').config()

const express = require('express');
const app = express();

const ejs = require('ejs');

const path = require('path');

const expressLayout = require('express-ejs-layouts')

const PORT = process.env.PORT || 3300

// database connection

const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session)

const passport = require('passport');


const url = 'mongodb://localhost/food';

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log('database connected');
}).catch(error =>{
    console.log('connection faild');
});

app.use(flash())

// session Store

let mongoStore = new MongoDbStore({
    mongooseConnection:connection,
    collection:'sessions'
})

// session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie: {maxAge: 1000*60*60*24}
 
}))

// passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// asset

app.use(express.static('public'))

app.use(express.json())

app.use(express.urlencoded({extended : false}))

// Global middleware

app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


// set Template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs');

require('./routes/web')(app)


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});