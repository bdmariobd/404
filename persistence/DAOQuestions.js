"use strict"

const timeUtils = require("../public/javascripts/timeUtils");

class DAOQuestions {
    constructor(pool) {
        this.pool = pool;
    }

    getAllQuestions(callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let query = "SELECT q.id, q.id_user, q.title, q.body, q.views, q.date, q.likes, q.dislikes, GROUP_CONCAT(DISTINCT t.name) as tags, u.name, u.image " +
                    "FROM (((question q join question_tag qt on q.id=qt.id_question) join tag t on qt.id_tag=t.id) join user u on q.id_user = u.id)" +
                    "WHERE q.active = 1 " +
                    " GROUP BY q.id ORDER BY q.date DESC";
                connection.query(
                    query,
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (rows.length === 0) {
                                callback(null, null); //no hay preguntas
                            } else {
                                rows.forEach(element => {
                                    element.dateAgo = timeUtils.getTimeAgo(element.date);
                                    element.tags = element.tags.split(',');
                                    element.shortBody = element.body.length > 150 ? element.body.substring(0, 150) + '...' : element.body;

                                });
                                callback(null, rows);
                            }
                        }
                    }
                );
            }
        });
    }

    getAllUnansweredQuestions(callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let query = "SELECT q.id, q.id_user, q.title, q.body, q.views, q.date, q.likes, q.dislikes, GROUP_CONCAT(DISTINCT t.name) as tags, u.name, u.image " +
                    "FROM (((question q join question_tag qt on q.id=qt.id_question) join tag t on qt.id_tag=t.id) join user u on q.id_user = u.id)" +
                    "WHERE q.active = 1 AND 0 = (select count(*) FROM answer a WHERE a.question_id = q.id)" +
                    " GROUP BY q.id ORDER BY q.date DESC";
                connection.query(
                    query,
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (rows.length === 0) {
                                callback(null, null); //no hay preguntas
                            } else {
                                rows.forEach(element => {
                                    element.dateAgo = timeUtils.getTimeAgo(element.date);
                                    element.tags = element.tags.split(',');
                                    element.shortBody = element.body.length > 150 ? element.body.substring(0, 150) + '...' : element.body;
                                });
                                callback(null, rows);
                            }
                        }
                    }
                );
            }
        });
    }
}

module.exports = DAOQuestions;