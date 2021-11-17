var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const config = require('../config');
const DAOUsers = require("../persistence/DAOUsers")

const pool = mysql.createPool({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database,
});

let daoUser = new DAOUsers(pool);

function logged(request) {
    if (request.session.currentUser !== undefined) return true;
    return false;
}
//user logged middleware
router.use(["/users", "/preguntas", "/profile"], (request, response, next) => {
    if (logged(request)) { //logged
        next();
    } else {
        response.redirect("login");
    }
});

/* router para /preguntas/... */
router.get('/', (req, res, next) => {
    res.render('preguntas');
});




module.exports = router;