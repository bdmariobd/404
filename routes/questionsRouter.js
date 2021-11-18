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
            if (rows === null) {
                res.render("preguntas", { error: "No hay preguntas todavía" });
            } else {
                console.log(rows);
                res.render("preguntas", { questions: rows });
            }
        }
    });
});

router.get('/sinResponder', (req, res, next) => {
    daoQuestions.getAllQuestions((error, questions) => {
        if (error) {
            res.status(500);
        }
        /* else {
                   let notAnswered = [];
                   //no funciona porque quiero obtener las respuestas en otro dao
                   //el for each es SINCRONO, pero la llamada no, por lo que sale del array recorriendo TODAS LAS PREGUNTAS, pero con el array
                   //notAnswered vacio.

                   //se que se puede arreglar con una funcion en daoQuestions que devuelva todas las preguntas SIN RESPUESTAS
                   //pero rompe un poco la logica dao y habria que hacer una query enorme
                   questions.forEach(element => {
                       daoAnswers.getAnswersByQuestion(element.id,
                           (err, answers) => {
                               if (err) {
                                   res.status(500);
                               } else {
                                   console.log(answers);
                                   if (answers === null || answers.length === 0) {
                                       notAnswered.push(element);
                                   }
                               }
                           });
                   });
                   res.status(200);
                   if (notAnswered.length === 0) {
                       res.render("preguntas", { error: 'No hay preguntas sin responder' });
                   } else {
                       console.log(notAnswered);
                       res.render("preguntas", { questions: notAnswered });
                   }
               } */
    })
})
module.exports = router;