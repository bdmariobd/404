var express = require('express');
var router = express.Router();
const DAOQuestions = require('../persistence/DAOQuestions')
const mysql = require("mysql");
const config = require('../config');
const DAOUsers = require("../persistence/DAOUsers");
const factoryDAO = require("../persistence/factoryDAO")

let daoQuestions = factoryDAO.getDAOQuestions();

/* router para /preguntas/... */
router.get('/', (req, res, next) => {
    daoQuestions.getAllQuestions((error, rows) => {
        if (error) {
            res.status(500);
        } else {
            res.status(200);
            if (rows === null || rows.lenght === 0) {
                res.render("preguntas", { error: "No hay preguntas todavía" });
            } else {
                console.log(rows);
                res.render("preguntas", { questions: rows });
            }
        }
    });
});

router.get('/sinResponder', (req, res, next) => {
    daoQuestions.getAllUnansweredQuestions((error, rows) => {
        if (error) {
            res.status(500);
        } else {
            res.status(200);
            if (rows === null || rows.lenght === 0) {
                res.render("preguntas", { error: "No hay preguntas todavía" });
            } else {
                console.log(rows);
                res.render("preguntas", { questions: rows });
            }
        }

    })
})


module.exports = router;