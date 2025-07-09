const express = require('express');
const router = express.Router();

// routes

router.get('/', app);

module.exports = router;

function app(req, res, next) {
    res.send({
        message: `${process.env.APP_NAME}`
    });
}
