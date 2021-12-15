var express = require('express');
var router = express.Router();
const DAOQuestions = require('../persistence/DAOQuestions')
const mysql = require("mysql");
const config = require('../config');
const DAOUsers = require("../persistence/DAOUsers");
const factoryDAO = require("../persistence/factoryDAO")
const { body, validationResult } = require("express-validator");


let daoQuestions = factoryDAO.getDAOQuestions();

/* router para /preguntas/... */
router.get('/', (req, res, next) => {
    daoQuestions.getAllQuestions((error, rows) => {
        if (error) {
            res.status(500);
            next(err);
        } else {
            res.status(200);
            if (rows === null || rows.lenght === 0) {
                res.render("preguntas", { titulo: "Todas las preguntas", error: "No hay preguntas todavía" });
            } else {
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

router.post('/formular',
    body('title').isLength({ min: 5, max: 100 }).withMessage('El titulo de tu pregunta debe tener de 5 a 100 carácteres'),
    body('body').isLength({ min: 10, max: 1000 }).withMessage('El cuerpo de tu pregunta no debe superar 1000 carácteres, y como mínimo deben ser 10'),
    body('tags').custom((value, { req }) => {
        //NO FUNCIONA
        let tags = value === '' ? [] : value.split(',').map(t => t.toLowerCase());
        if (tags.lenght > 0) {
            tags.forEach(t => {
                if (t.lenght >= 20) return false;
            });
        }
        return true
    }).withMessage('No puedes usar tags de mas de 20 carácteres'),
    body('tags').custom((value, { req }) => {
        //NO FUNCIONA
        let tags = value === '' ? [] : value.split(',').map(t => t.toLowerCase());
        if (tags.lenght > 0) {
            tags.forEach(t => {
                if (!t.match(/^[0-9a-z]+$/)) return false;
            });
        }
        return true
    }).withMessage('Las tags solo deben contener caracteres alfanuméricos'),
    (req, res, next) => {
        let errors = validationResult(req).errors;
        if (errors.length > 0) {
            res.render("formular", { errors: errors });
        } else {
            console.log("yo no me voy a ejecutar >:c")
            const title = req.body.title.trim(),
                body = req.body.body.trim(),
                tags = req.body.tags === '' ? [] : req.body.tags.split(',').map(t => t.toLowerCase());
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
    daoQuestions.searchByText(text, (err, questions) => {
        if (err) {
            res.status(500);
            next(err);
        } else {
            res.status(200);
            res.render("preguntas", { titulo: 'Resultados de la búsqueda "' + text + '"', questions: questions });
        }
    })
})


router.get("/tag/:id", (req, res, next) => {
    const tag = req.params.id;
    daoQuestions.searchByTag(tag, (err, questions) => {
        if (err) {
            res.status(500);
            next(err);
        } else {
            res.status(200);
            res.render("preguntas", { titulo: 'Preguntas con la etiqueta "' + tag + '"', questions: questions });
        }
    })
})

router.get("/:id", (req, res, next) => {
    daoQuestions.getQuestion(req.params.id, req.session.idU, (err, questions) => {
        if (err) {
            res.status(500);
            next(err);
        } else {
            /* if (questions[0].my_vote === null) {
                questions[0].my_vote = -1;
            } */
            daoQuestions.getAnswers(req.params.id, req.session.idU, (err, answers) => {
                if (err) {
                    res.status(500);
                    next(err);
                } else {
                    res.render("unapregunta", { question: questions[0], answers: answers });
                }
            })

        }

    })
})

router.post("/:id",
    body("body").isLength({ min: 5, max: 1000 }).withMessage("Procura que tu respuesta tenga entre 5 y 1000 carácteres"),
    (req, res, next) => {
        let errors = validationResult(req).errors;
        if (errors.length > 0) {
            res.status(200)
            res.render("unapregunta", { errors: errors });
        } else {
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
        }

    })


router.post("/:id/like", (req, res, next) => {
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

router.post("/:id/answer/:idAnswer/like", (req, res, next) => {
    const user = req.session.idU,
        answer = req.params.idAnswer;
    positive = req.body.action === "👍🏼 Like" ? 1 : 0;
    daoQuestions.addVoteAnswer(user, answer, positive, (err, result) => {
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