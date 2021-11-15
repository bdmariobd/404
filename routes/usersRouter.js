var express = require('express');
var router = express.Router();

/* router para /usuarios/... */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

router.get("/profile", (request, response) => {
    response.status(200);
    response.render("profile");
})

module.exports = router;