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
                res.render("preguntas", { titulo: "Todas las preguntas", error: "No hay preguntas todavía" });
            } else {
                rows.forEach(element => {
                    console.log(element);
                });
                res.render("preguntas", { titulo: "Todas las preguntas", questions: rows });
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
                res.render("preguntas", { titulo: "Preguntas sin responder", error: "No hay preguntas todavía" });
            } else {
                res.render("preguntas", { titulo: "Preguntas sin responder", questions: rows });
            }
        }

    })
})

router.get('/formular', (req, res, next) => {
    res.render('formular');
})

router.post('/formular', (req, res, next) => {
    const title = req.body.title,
        body = req.body.body,
        tags = req.body.tags;
    daoQuestions.createQuestion(req.session.idU, title, body, tags, (err, rows) => {
        if (err) {
            res.status(500);
        } else {
            console.log(rows);
            res.redirect("/preguntas");
        }
    })
})

router.get("/:id", (req, res, next) => {
    daoQuestions.getQuestion(req.params.id, (err, questions) => {
        console.log('e');
        console.log(questions);
        if (err) {
            res.status(500);
        } else {
            daoQuestions.getAnswers(req.params.id, (err, answers) => {
                if (err) {
                    res.status(500);
                } else {
                    res.status(200);
                    res.render("unapregunta", { question: questions[0], answers: answers });
                }
            })

        }

    })
})
module.exports = router;