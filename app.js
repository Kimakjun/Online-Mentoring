const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();

const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');
const passportConfig = require('./passport');

const app = express();
sequelize.sync();
passportConfig(passport);



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8001);


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res, next) => {
    res.render('main', {title : "test", user : req.user});
})

app.get('/login', (req, res, next) => {
    res.render('login',{title : "test", user : req.user} );
})

app.get('/join', (req, res, next) => {
    res.render('join', {user : req.user,  joinError: req.flash('joinError') } );
})

app.post('/auth/join', async (req, res, next) => {
    const { email, nick, password, info } = req.body;
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        req.flash('joinError', '이미 가입된 이메일입니다.');
        return res.redirect('/join');
      }
      const hash = await bcrypt.hash(password, 12);
      await User.create({
        email,
        nick,
        info,
        password: hash,
      });
      return res.redirect('/login');
    } catch (error) {
      console.error(error);
      return next(error);
    }
})

app.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        req.flash('loginError', info.message);
        return res.redirect('/');
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.redirect('/');
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
  });

 app.get('/auth/logout', (req, res, next) => {
     req.logout();
     res.redirect('/');
 }) 

app.get('/post', (req, res, next) => {
    res.render('post',{title : "test", user : req.user} );

})

app.post('/post', async (req, res, next)=>{
    const {title, content, date, start, end} = req.body;
    try{
        console.log(title, content, typeof(date), typeof(start), typeof(end));
        res.redirect('/');
    }catch(error){
        console.error(error);
        next(error);
    }
})

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

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});



