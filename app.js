const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const webSocket = require('./socket');

require('dotenv').config();

const bcrypt = require('bcrypt');
const { sequelize, User, Post } = require('./models');
const passportConfig = require('./passport');
 
const app = express();
sequelize.sync();
passportConfig(passport);


const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
})

const test;
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');  
const roomRouter = require('./routes/room');

  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8001);
   



app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'fonts')));
app.use(express.static(path.join(__dirname, 'images')));
app.use('/post', express.static(path.join(__dirname, 'images')));
app.use('/room', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {


   if(!req.session.nick && req.user){
     req.session.nick = req.user.nick;     
     console.log(req.session.nick);
   }
   
  next();
})

app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/room', roomRouter);


app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

webSocket(server, app, sessionMiddleware);


