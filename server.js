require('rootpath')();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const errorHandler = require('./middleware/error-handler');

const corsOptions ={
    origin:'http://localhost:8000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api routes
app.use('/users', require('./controllers/users.controller'));
app.use('/roles', require('./controllers/roles.controller'));
app.use('/permissions', require('./controllers/permissions.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));