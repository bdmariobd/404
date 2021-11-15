var express = require('express');
var router = express.Router();

/* router para /preguntas/... */
router.get('/', (req, res, next) => {
    res.render('preguntas');
});

module.exports = router;