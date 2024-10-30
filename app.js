const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');

const routes1 = require('./routes/index');
const routes2 = require('./routes/api/routes');

const app = express();

// view engine setup
const exphbs = require('express-handlebars');
//
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/components', express.static(path.join(__dirname, 'components')));

// khai báo
const database = require('./config/db');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
// sử dụng
database();
//======================================================//
// Cấu hình session middleware
app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 // Thời gian tồn tại của session (ở đây là 1 giờ)
}
}));

// Routes
app.use('/', routes1);
app.use('/', routes2);

// Cấu hình body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Bắt lỗi 404
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Xử lý lỗi
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error'); // Đảm bảo bạn có tệp error.hbs để hiển thị
});


// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

module.exports = app;
