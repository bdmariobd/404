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
            next(err);
        } else {
            console.log(req.app.locals);
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
            next(err);
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
    const title = req.body.title.trim(),
        body = req.body.body.trim(),
        tags = req.body.tags === '' ? [] : req.body.tags.split().map(t => t.toLowerCase());

    if (title === "hola") {
        res.render("formular", { formError: "no me vale ese titulo" });
    } else {
        daoQuestions.createQuestion(req.session.idU, title, body, tags, (err, rows) => {
            if (err) {
                res.status(500);
                next(err);
            } else {
                res.redirect("/preguntas");
            }
        })
    }

})



router.get("/search", (req, res, next) => {
    const text = req.query.search;
    //console.log(text);
    daoQuestions.searchByText(text, (err, questions) => {
        if (err) {
            res.status(500);
            next(err);
        } else {
            res.status(200);
            //console.log(questions);
            res.render("preguntas", { titulo: 'Resultados de la búsqueda "' + text + '"', questions: questions });
        }
    })
})


router.get("/tag/:id", (req, res, next) => {
    const tag = req.params.id;
    console.log(tag);
    daoQuestions.searchByTag(tag, (err, questions) => {
        if (err) {
            res.status(500);
            next(err);
        } else {
            res.status(200);
            //console.log(questions);
            res.render("preguntas", { titulo: 'Preguntas con la etiqueta "' + tag + '"', questions: questions });
        }
    })
})

router.get("/:id", (req, res, next) => {
    daoQuestions.getQuestion(req.params.id, (err, questions) => {
        if (err) {
            res.status(500);
            next(err);
        } else {
            daoQuestions.getAnswers(req.params.id, (err, answers) => {
                if (err) {
                    res.status(500);
                    next(err);
                } else {
                    // console.log(questions);
                    // console.log(answers)
                    res.render("unapregunta", { question: questions[0], answers: answers });
                }
            })

        }

    })
})

router.post("/:id", (req, res, next) => {
    const user = req.session.idU,
        body = req.body.body,
        question = req.params.id;
    daoQuestions.createAnswer(user, question, body, (err, result) => {
        if (err) {
            res.status(500);
            next(err);
        } else {
            res.status(200);
            res.redirect("/preguntas/" + req.params.id);
        }

    })
})


router.post("/:id/like", (req, res) => {
    const user = req.session.idU,
        question = req.params.id;
    positive = req.body.action === "👍🏼 Like" ? 1 : 0;
    daoQuestions.addVoteQuestion(user, question, positive, (err, result) => {
        if (err) {
            res.status(500);
            next(err);
        } else {
            res.status(200);
            res.redirect("/preguntas/" + req.params.id);
        }
    })

})

router.post("/:id/answer/:id/like", (req, res) => {
    const user = req.session.idU,
        question = req.params.id;
    positive = req.body.action === "👍🏼 Like" ? 1 : 0;
    daoQuestions.addVoteAnswer(user, question, positive, (err, result) => {
        if (err) {
            res.status(500);
            next(err);
        } else {
            res.status(200);
            res.redirect("/preguntas/" + req.params.id);
        }
    })

})

module.exports = router;