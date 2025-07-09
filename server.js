require('rootpath')();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const errorHandler = require('./middleware/error-handler');
require('./config/passport');
const passport = require('passport');
const authRoutes = require('./routes/auth.router');
const authMiddleware = require('./middleware/auth');

// system settings
const corsOptions ={
    origin:'http://localhost:8000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

global.__basedir = __dirname;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


// api protected routes
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Rota protegida acessada com sucesso' });
  });
// api routes
app.use('/auth', authRoutes);
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
app.listen(port, () => console.log('Server listening on port ' + port));