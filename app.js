const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');
const http = require('http');

const routes1 = require('./routes/index');
const routes2 = require('./routes/api/routes');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.js
// app.set('view engine', 'hbs'); // hoặc 'hbs' nếu dùng Handlebars
// app.set('views', path.join(__dirname, 'views')); // Thư mục chứa file views
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

// Session middleware
app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// // Redirect root URL to the login page
// app.get('/', (req, res) => {
//   res.redirect('/api/v1/login'); // Change this path based on your actual login route
// });

// Routes
app.use('/', routes1);
app.use('/', routes2);

// Catch 404 errors
// Bắt lỗi 404
app.use((req, res, next) => {
  next(createError(404));
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
