const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const connectDB = require('./config/db');

//Load config env
dotenv.config({ path: './config/config.env' });

//Passport config
const {googlePass, githubPass} = require('./config/passport');
googlePass(passport);
githubPass(passport);

connectDB();

const app = express();

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method override for form method PUT and DELETE
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//HandleBars helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');

//HandleBars
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

//Sessions
app.use(
  session({
    secret: 'abregre',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/memos', require('./routes/memos'));

//PORT AND LISTEN
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);