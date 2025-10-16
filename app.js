require('rootpath')();
require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const errorHandler = require('./middlewares/errorHandler.middleware');
const injectLogger = require('./middlewares/logger.middleware');
const morganMiddleware = require('./middlewares/morgan.middleware');
const initPassportStrategy = require('./config/passport');
const authMiddleware = require('./middlewares/auth.middleware');
const { publicLimiter, privateLimiter } = require("./middlewares/rateLimiter.middleware");


// Swagger 
const swaggerDocument = YAML.load('./docs/swagger.yaml');


// Express App 
const app = express();


// Environment variables 
const APP_NAME = process.env.APP_NAME || 'Express Levidade API';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8000';
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX) || 100;
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW) || 15;


// CORS Config 
const corsOptions = {
  origin: FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};


// Global Middlewares 
global.__basedir = __dirname;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
app.use(rateLimit({
  windowMs: RATE_LIMIT_WINDOW * 60 * 1000, // minutos → ms
  max: RATE_LIMIT_MAX,
}));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Passport 
initPassportStrategy(passport);
app.use(passport.initialize());


// Logger 
const appLogger = injectLogger(app);
app.use(morganMiddleware());


// Routes
const publicRouterV1 = require('./routes/v1/public/auth.router');
const privateRouterV1 = require('./routes/v1/private/auth.router');
const privateArticleRouterV1 = require('./routes/v1/private/articles.router');
const privateCategoryRouterV1 = require('./routes/v1/private/categories.router');
const privateFileRouterV1 = require('./routes/v1/private/files.router');
const privatePermissionRouterV1 = require('./routes/v1/private/permissions.router');
const privateRoleRouterV1 = require('./routes/v1/private/roles.router');
const privateSettingRouterV1 = require('./routes/v1/private/settings.router');
const privateStatusRouterV1 = require('./routes/v1/private/status.router');
const privateUserRouterV1 = require('./routes/v1/private/users.router');

// Protected routes example 
/* app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route successfully accessed' });
}); */

// Private Routes
app.use('/api/v1/private/auth', privateLimiter, privateRouterV1);
app.use('/api/v1/private/article', privateLimiter, privateArticleRouterV1);
app.use('/api/v1/private/category', privateLimiter, privateCategoryRouterV1);
app.use('/api/v1/private/file', privateLimiter, privateFileRouterV1);
app.use('/api/v1/private/permission', privateLimiter, privatePermissionRouterV1);
app.use('/api/v1/private/role', privateLimiter, privateRoleRouterV1);
app.use('/api/v1/private/setting', privateLimiter, privateSettingRouterV1);
app.use('/api/v1/private/status', privateLimiter, privateStatusRouterV1);
app.use('/api/v1/private/user', privateLimiter, privateUserRouterV1);

// Public Routes 
app.use('/api/v1/public/auth', publicLimiter, publicRouterV1);


// Swagger 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Static Files 
app.use('/storage', express.static(path.join(__dirname, 'storage'), {
  setHeaders: (res) => {
    res.set({
      'Access-Control-Allow-Origin': FRONTEND_URL,
      'Access-Control-Allow-Credentials': 'true',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cache-Control': 'public, max-age=3600'
    });
  }
}));


// Global Error Handler 
app.use(errorHandler);

 
module.exports = { app, appLogger, APP_NAME };