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


// [
//     RowDataPacket {
//       id: 1,
//       date: 2021-11-08T23:00:00.000Z,
//       email: 'nico@404.es',
//       pass: '1234',
//       image: 'nico.png',
//       name: 'Nico',
//       active: 1,
//       reputation: 1
//     }
//   ]

// RowDataPacket {
//     id: 1,
//     name: 'medalla3',
//     metal: 'gold',
//     merit: 0,
//     type: 'question_vote',
//     active: 1
//   }
/* router para /preguntas/... */
router.get('/', (req, res, next) => {

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



module.exports = router;