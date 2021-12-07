var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const config = require('../config');
const DAOUsers = require("../persistence/DAOUsers")
const multer = require('multer')
const { body, validationResult } = require("express-validator");


const multerFactory = multer({ storage: multer.memoryStorage() });



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
        response.locals.user = { idU: request.session.idU, name: request.session.name, currentUser: request.session.currentUser };
        next();
    } else {
        response.redirect("login");
    }
});


router.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.status(200)
    res.redirect('login')
})

router.get("/", (request, response, next) => {
    response.status(200);
    if (logged(request)) {
        response.redirect("preguntas");
    } else {
        response.redirect("login");
    }
});

router.get("/login", (request, response, next) => {
    response.status(200);
    response.render("login");
});


router.post("/login",
    body("email").isEmail(),
    body("password").isLength({ min: 2 }),
    (request, response, next) => {
        //todo meter esto en un controller
        daoUser.isUserCorrect(request.body.email, request.body.password,
            (err, result) => {
                const errors = validationResult(request);
                if (!errors.isEmpty()) {
                    console.log(errors);
                } else if (err) {
                    response.status(500);
                    next(err);
                } else {
                    response.status(200)
                    if (!result) {
                        console.log("Email/pass not valid");
                        response.render("login");
                    } else {
                        request.session.idU = result.user.id;
                        request.session.name = result.user.name;
                        request.session.currentUser = request.body.email;
                        console.log(request.session.idU)
                        console.log(request.session.name)
                        response.redirect("preguntas");
                    }
                }
            });

    });



router.get("/signup", (request, response, next) => {
    response.status(200);
    response.render("signup");
});

router.post("/signup", multerFactory.single('pp'), (request, response, next) => {
    //todo meter esto en un controller
    const email = request.body.email;
    const username = request.body.username;
    let foto = null;
    if (request.file) {
        foto = request.file.buffer;
    }
    const pass1 = request.body.password1;
    const pass2 = request.body.password2;
    const pp = foto;
    if (pass1 !== pass2) {
        response.render("signup", { error: "Las contraseñas no coinciden" });
    } else {
        daoUser.userExists(email, (err, exists) => {
            if (err) {
                console.log("ya existe");
                response.status(500);
                next(err);
            } else {
                if (exists) {
                    response.render("signup", { error: "Este correo es inválido o ya está siendo utilizado" });
                } else {
                    daoUser.create(email, username, pp, pass1,
                        (err, rows) => {
                            if (err) {
                                response.status(500);
                                console.log("Error creating user: " + err.message);
                                response.render("signup", null);
                            } else {
                                response.status(200)
                                if (rows === null) {
                                    console.log("error");
                                    response.render("singup", null);
                                } else {
                                    console.log(rows)
                                    response.redirect("/");
                                }
                            }
                        });
                }
            }
        });

    }



});

module.exports = router;