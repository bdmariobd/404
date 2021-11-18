var express = require('express');
var router = express.Router();
const factoryDAO = require("../persistence/factoryDAO")

const daoUser = factoryDAO.getDAOUsers();
/* router para /usuarios/... */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

router.get("/profile", (request, response) => {
    response.status(200);
    response.render("profile");
})


router.get('/miPerfil', (req, res, next) => {

    var user = daoUser.getUserbyEmail(req.session.currentUser, (err, result) => {
        if (err) {
            res.status(500);
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
                    } else {
                        res.status(200)
                        if (!result) {
                            console.log("No tiene medallas");

                        } else {
                            res.render('profile', { _user: user, golds: result.gold, silvers: result.silvers, bronces: result.bronces });
                            res.status(200);

                        }
                    }
                });


            }
        }
    });

});


router.get('/:id', (req, res, next) => {

    let user = daoUser.getUserbyId(req.params.id, (err, result) => {
        if (err) {
            res.status(500);
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
                    } else {
                        res.status(200)
                        if (!result) {
                            console.log("No tiene medallas");

                        } else {
                            res.render('profile', { _user: user, golds: result.gold, silvers: result.silvers, bronces: result.bronces });
                            res.status(200);

                        }
                    }
                });


            }
        }
    });

});

module.exports = router;