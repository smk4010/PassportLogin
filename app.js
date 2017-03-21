const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

//Dev Port Constant
const port = 3000;

//Route Files
const index = require('./routes/index');
//const users = require('./routes/users');

//Init app
const app = express();

//View Engine Init
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
  secret: 'secret',
  saveUnitialized: true,
  resave: true
}));

//Init passport
app.use(passport.initialize());
app.use(passport.session());

//Express Messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error_msg = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      const namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Init routes
app.use('/', index);
//app.use('/users', users);

//Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
