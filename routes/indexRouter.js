var express = require('express');
var router = express.Router();
const factoryDAO = require("../persistence/factoryDAO")
const multer = require('multer')
const fs = require('fs')
const maxSize = 126400000; // 15.9 MB
const { body, validationResult, check } = require("express-validator");


const multerFactory = multer({
    storage: multer.memoryStorage(),
    limits: { filieSize: maxSize }
});

let daoUser = factoryDAO.getDAOUsers();

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
        response.redirect("/login");
    }
});


router.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.status(200)
    res.redirect('/login')
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
    body("email").isEmail().withMessage("El email no es válido"),
    body("password").isLength({ min: 4, max: 50 }).withMessage("La contraseña no cumple el formato - Debe ser de 4 a 50 carácteres alfanuméricos con o sin símbolos")
    .isAscii().withMessage("La contraseña no cumple el formato - Debe ser de 4 a 50 carácteres alfanuméricos con o sin símbolos)"),
    (request, response, next) => {
        response.status(200)
        let rs = [];
        let errors = validationResult(request).errors;
        if (errors.length > 0) {
            response.render("login", { errors: errors }).end();
        }
        daoUser.isUserCorrect(request.body.email, request.body.password,
            (err, result) => {
                if (err) {
                    response.status(500);
                    next(err);
                } else {
                    if (!result) {
                        response.render("login", { errors: [{ msg: "Las credenciales son incorrectas" }] });
                    } else {
                        request.session.idU = result.user.id;
                        request.session.name = result.user.name;
                        request.session.currentUser = request.body.email;
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
    body('username').isAlphanumeric().withMessage("El nombre de usuario debe contener caracteres solo alfanuméricos").isLength({ min: 3, max: 50 }).withMessage("El nombre de usuario debe ser de 2 a 50 carácteres"),
    body("email").isEmail().withMessage("El email no es válido"),
    body("password1").isLength({ min: 4, max: 50 }).withMessage("La contraseña no cumple el formato - Debe ser de 4 a 50 carácteres alfanuméricos con o sin símbolos")
    .isAscii().withMessage("La contraseña no cumple el formato - Debe ser de 4 a 50 carácteres alfanuméricos con o sin símbolos)"),
    body('password2').custom((value, { req }) => {
        if (value !== req.body.password1) return false;
        return true;
    }).withMessage('Las contraseñas no coinciden'),
    check('pp').custom((value, { req }) => {
        if (!req.file || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/jpeg') return true;
        return false
    }).withMessage('Los formatos soportados de imagen son png, jpg y jpeg'),
    (request, response, next) => {
        let errors = validationResult(request).errors;
        if (errors.length > 0) {
            response.status(200)
            response.render("signup", { errors: errors }).end();
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
                next(new Error("Fallo interno del servidor al escoger una imagen aleatoria para ti"));
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
                        response.status(200)
                        response.render("signup", {
                            errors: [{ msg: "Este correo ya está siendo utilizado" }]
                        })
                    } else {
                        daoUser.create(email, username, pp, pass1,
                            (err, rows) => {
                                if (err) {
                                    response.status(500);
                                } else {
                                    if (rows === null) {
                                        next(new Error("No se ha podido crear tu cuenta"));
                                    } else {
                                        response.status(200)
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