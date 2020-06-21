const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const webSocket = require('./socket');
const helmet = require('helmet');
const hpp = require('hpp')
const RedisStore = require('connect-redis')(session);
require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');  
const roomRouter = require('./routes/room');
const {sequelize} = require('./models');
const passportConfig = require('./passport');
const logger = require('./logger');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8001);

if(process.env.NODE_ENV === 'production'){
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
}else{
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'fonts')));
app.use(express.static(path.join(__dirname, 'images')));
app.use('/post', express.static(path.join(__dirname, 'images')));
app.use('/room', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASSWORD,
    logErrors: true,
  }),
};
if(process.env.NODE_ENV === 'production'){
  sessionOption.proxy = true;
}
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());





app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/room', roomRouter);


app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  logger.info('hello'); // console.info 대체
  logger.error(err.message); // console.error 대체
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

webSocket(server, app, session(sessionOption));
