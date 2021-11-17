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

    res.render('profile', { _name: "Nico" });
    res.status(200);



});

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
                var username = result[0].name;
                console.log(result[0].name)
                res.render('profile', { _name: username });
                res.status(200);
            }
        }
    });

});



module.exports = router;