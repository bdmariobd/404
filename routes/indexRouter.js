var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const config = require('../config');
const DAOUsers = require("../persistence/DAOUsers")
const multer = require('multer')
const fs = require('fs')
const maxSize = 126400000; // 15.9 MB
const { body, validationResult } = require("express-validator");


const multerFactory = multer({
    storage: multer.memoryStorage(),
    limits: { filieSize: maxSize }
});



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
    body("password").isLength({ min: 4 }),
    (request, response, next) => {
        //todo meter esto en un controller
        daoUser.isUserCorrect(request.body.email, request.body.password,
            (err, result) => {
                if (err) {
                    response.status(500);
                    next(err);
                } else {
                    response.status(200)
                    let rs = [];
                    let errors = validationResult(request).errors;
                    // Result {
                    //     formatter: [Function: formatter],
                    //     errors: [
                    //       {
                    //         value: 'nico@404es',
                    //         msg: 'Invalid value',
                    //         param: 'email',
                    //         location: 'body'
                    //       },
                    //       {
                    //         value: '1',
                    //         msg: 'Invalid value',
                    //         param: 'password',
                    //         location: 'body'
                    //       }
                    //     ]
                    //   }
                    if (errors.length > 0) {
                        console.log(errors);
                        errors.forEach(x => {
                            if (x.param === 'email') {
                                rs.push("El email " + x.value + " es invalido");
                            } else {
                                rs.push("La password no cumple el formato");
                            }
                        });

                    }
                    if (!result) {
                        rs.push("Las credenciales son incorrectas")
                    }
                    if (rs.length > 0) {
                        response.render("login", { errors: rs });
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

router.post("/signup",
    multerFactory.single('pp'),
    body('username').isAlphanumeric(),
    body("email").isEmail(),
    body("password1").isLength({ min: 4 }).isAscii(),
    body('password2').custom((value, { req }) => {
        if (value !== req.body.password1) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),

    (request, response, next) => {
        let rs = [];
        let errors = validationResult(request).errors;
        if (errors.length > 0) {
            console.log(errors);
            errors.forEach(x => {
                if (x.param === 'email') {
                    rs.push("El email " + x.value + " es invalido");
                } else if (x.param === 'username') {
                    rs.push("El nombre de usuario debe contener caracteres solo alfanuméricos")
                } else if (x.param === 'password1') {
                    rs.push("La contraseña no cumple el formato - Debe ser de 4 a 50 carácteres alfanuméricos con o sin símbolos)");
                } else {
                    rs.push("Las passwords no coinciden")
                }
            });
            response.render("signup", { errors: rs }).end();

        }
        let pp = null;
        if (request.file) {
            pp = request.file.buffer;
            processRequest(null, pp);
        } else {
            const random_num = Math.floor(Math.random() * 3) + 1;
            fs.readFile("public/images/defecto" + random_num + ".png", processRequest);
        }

        function processRequest(err, pp) {
            if (err) {
                response.status(500);
                next(err);
            }
            const email = request.body.email;
            const username = request.body.username;
            const pass1 = request.body.password1;
            const pass2 = request.body.password2;
            daoUser.userExists(email, (err, exists) => {
                if (err) {
                    response.status(500);
                    next(err);
                } else {
                    if (exists) {
                        rs.push("Este correo es inválido o ya está siendo utilizado")
                        response.render("signup", { errors: rs })
                    } else {
                        daoUser.create(email, username, pp, pass1,
                            (err, rows) => {
                                if (err) {
                                    response.status(500);
                                    next(err);
                                } else {
                                    response.status(200)
                                    if (rows === null) {
                                        rs.push("No se ha creado tu cuenta")
                                        response.render("signup", { errors: rs })
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