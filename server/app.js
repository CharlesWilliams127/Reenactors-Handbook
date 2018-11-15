const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const csrf = require('csurf');
// const masonry = require('masonry');
// const imagesLoaded = require('imagesloaded');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/ReenactorsHandbook';

mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to DB');
    throw err;
  }
});

const router = require('./router.js');

const app = express();
app.use('/masonry',express.static(path.resolve(`${__dirname}/../node_modules/masonry-layout/dist/masonry.pkgd.min.js`)));
app.use('/imagesLoaded', express.static(path.resolve(`${__dirname}/../node_modules/imagesloaded/imagesloaded.pkgd.min.js`)));
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(session({
  key: 'sessionid',
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');
app.use(cookieParser());

app.use(csrf());
// app.use((req, res, next) => {
//   app.locals.csrfToken = req.csrfToken();
//   next();
// });

app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token');
  return false;
});

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
