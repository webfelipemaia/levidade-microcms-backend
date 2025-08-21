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
const injectLogger = require('./middlewares/logger.middleware');
const morganMiddleware = require('./middlewares/morgan.middleware');
const initPassportStrategy = require('./config/passport');
const authMiddleware = require('./middlewares/auth.middleware');
const { publicLimiter, privateLimiter } = require("./middlewares/rateLimiter.middleware");

// Configurar Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml'); // caminho para o arquivo YAML


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

const appLogger = injectLogger(app);
app.use(morganMiddleware());


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

// api private routes
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Rota protegida acessada com sucesso' });
  });

app.use('/api/v1/private/auth', privateLimiter, privateRouterV1);
app.use('/api/v1/private/article', privateLimiter, privateArticleRouterV1);
app.use('/api/v1/private/category', privateLimiter, privateCategoryRouterV1);
app.use('/api/v1/private/file', privateLimiter, privateFileRouterV1);
app.use('/api/v1/private/permission', privateLimiter, privatePermissionRouterV1);
app.use('/api/v1/private/role', privateLimiter, privateRoleRouterV1);
app.use('/api/v1/private/setting', privateLimiter, privateSettingRouterV1);
app.use('/api/v1/private/status', privateLimiter, privateStatusRouterV1);
app.use('/api/v1/private/user', privateLimiter, privateUserRouterV1);

// api public routes
app.use('/api/v1/public/auth', publicLimiter, publicRouterV1);


// global error handler
app.use(errorHandler);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    appLogger.info(`Server listening on port ${port}`);
  });
}

// for test
module.exports = app;