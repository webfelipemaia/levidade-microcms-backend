require('rootpath')();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const errorHandler = require('./middlewares/errorHandler.middleware');
const initPassportStrategy = require('./config/passport');
const authMiddleware = require('./middlewares/auth.middleware');
const { publicLimiter, privateLimiter } = require("./middlewares/rateLimiter.middleware");

// system settings
const corsOptions ={
    origin:'http://localhost:8000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionSuccessStatus: 200
}

global.__basedir = __dirname;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de requisições por IP
}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
initPassportStrategy(passport);
app.use(passport.initialize());


const publicRouterV1 = require('./routes/v1/public/auth.router');
const privateRouterV1 = require('./routes/v1/private/auth.router');

// api private routes
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Rota protegida acessada com sucesso' });
  });

app.use('/api/v1/private/auth', privateLimiter, privateRouterV1);

// api public routes
app.use('/api/v1/public/auth', publicLimiter, publicRouterV1);

app.use('/', require('./controllers/app.controller'));
app.use('/users', require('./controllers/users.controller'));
app.use('/roles', require('./controllers/roles.controller'));
app.use('/permissions', require('./controllers/permissions.controller'));
app.use('/categories', require('./controllers/categories.controller'));
app.use('/articles', require('./controllers/articles.controller'));
app.use('/status', require('./controllers/status.controller'));
app.use('/files', require('./controllers/files.controller'));
app.use('/settings', require('./controllers/settings.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// for test
module.exports = app;