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

router.get("/:id", (req, res, next) => {
    // req.params will have the URL's username parameter
    daoUser.userExistsbyId(req.params.id, (error, result) => {
        if (err) {
            response.status(500);
        } else {
            res.status(200);
            res.render('profile/:id')
        }


    });

    daoUser.isUserCorrect(request.body.email, request.body.password,
        (err, result) => {
            if (err) {
                response.status(500);
            } else {
                response.status(200)
                if (!result) {
                    console.log("Email/pass not valid");
                    response.render("login");
                } else {
                    request.session.currentUser = request.body.email;
                    console.log(request)
                    response.redirect("preguntas");
                }
            }
        });
})

/* router para /preguntas/... */
router.get('/', (req, res, next) => {
    res.render('profile');
});



module.exports = router;