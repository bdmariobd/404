"use strict"
var express = require('express');
var router = express.Router();
const factoryDAO = require("../persistence/factoryDAO")
const daoUser = factoryDAO.getDAOUsers();

/* router para /usuarios/... */

router.get('/', (req, res, next) => {
    daoUser.getAllUsers((err, users) => {
        console.log(users)
        if (err) {
            console.log(err.message);
            res.status(500);
            next(err);
        } else {
            res.status(200);
            if (!users) {
                console.log("no usuers")
            } else {
                res.render('users', { _users: users });

            }
        }
    })
})
router.get('/search', (req, res, next) => {
    daoUser.searchUserByString(req.query.search, (err, users) => {
        console.log(users)
        if (err) {
            res.status(500);
            next(err);
        } else {
            res.status(200);
            if (!users) {
                console.log("no usuers")
            } else {
                res.render('users', { _users: users });

            }
        }
    })
})

router.get('/miPerfil', (req, res, next) => {
    console.log(req.session.idU)
    var user = daoUser.getUserbyId(req.session.idU, (err, result) => {
        if (err) {
            res.status(500);
            next(err);
        } else {
            res.status(200)
            if (!result) {
                console.log("Email/pass not valid");

            } else {
                const user = result[0];
                console.log(result[0].name)

                daoUser.getMedals(req.session.currentUser, (err, result) => {
                    if (err) {
                        res.status(500);
                        next(err);
                    } else {
                        res.status(200)
                        if (!result) {
                            console.log("No tiene medallas");

                        } else {
                            res.render('profile', { _user: user, golds: result.gold, silvers: result.silver, bronces: result.bronce });
                            res.status(200);

                        }
                    }
                });


            }
        }
    });

});

router.get('/imagen/:id', function(request, response) {

    let n = Number(request.params.id);
    if (isNaN(n)) {
        response.status(400);
        response.end("Petición incorrecta");
    } else {
        daoUser.obtenerImagen(n, function(err, imagen) {
            if (imagen) {
                response.end(imagen);
            } else {
                response.end("Not found");
            }
        });
    }

});






router.get('/:id', (req, res, next) => {

    let user = daoUser.getUserbyId(req.params.id, (err, result) => {
        if (err) {
            res.status(500);
            next(err);
        } else {
            res.status(200)
            if (!result) {
                console.log("Email/pass not valid");
                res.status(500);

            } else {
                const user = result[0];
                console.log(result[0].name)

                daoUser.getMedals(user.email, (err, result) => {
                    if (err) {
                        res.status(500);
                    } else {
                        res.status(200)
                        if (!result) {
                            console.log("No tiene medallas");

                        } else {
                            res.render('profile', { _user: user, golds: result.gold, silvers: result.silver, bronces: result.bronce });
                            res.status(200);

                        }
                    }
                });


            }
        }
    });

});

module.exports = router;