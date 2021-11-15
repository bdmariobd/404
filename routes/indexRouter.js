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
router.use(["/users", "/preguntas"], (request, response, next) => {
    if (logged(request)) { //logged
        next();
    } else {
        response.redirect("login");
    }
});

//404 and 500 error handling
router.use((request, response, next) => {
    response.status(404);
    next();
    //response.render("404");
});
router.use((request, response, next) => {
    response.status(500);
    next();
    //response.render("500", error:... );
});


router.get("/", (request, response) => {
    response.status(200);
    if (logged(request)) {
        response.redirect("preguntas");
    } else {
        response.redirect("login");
    }
});

router.get("/login", (request, response) => {
    response.status(200);
    response.render("login");
});


router.post("/login", (request, response) => {
    //todo meter esto en un controller
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

});

router.get("/signup", (request, response) => {
    response.status(200);
    response.render("signup");
});

router.post("/signup", (request, response) => {
    //todo meter esto en un controller

    let pass1 = request.body.password1;
    let pass2 = request.body.password2;
    if (pass1 !== pass2) {
        response.render("signup", { error: "Las contraseñas no coinciden" });
    } else {
        daoUser.userExists(request.body.email, (err, exists) => {
            if (err) {
                response.status(500);
            } else {
                if (exists) {
                    response.render("signup", { error: "Este correo es inválido o ya está siendo utilizado" });
                } else {
                    //daoUser.create(request.body.email, request.body.)...
                }
            }
        });
    }
    response.status(200);
    response.render("signup");
});

module.exports = router;