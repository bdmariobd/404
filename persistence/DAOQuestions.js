"use strict"


class DAOTasks {
    constructor(pool) {
        this.pool = pool;
    }

    getAllQuestions(callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let query = "SELECT * " +
                    "FROM (question q join question_tag qt on q.id=qt.id_question) join tag t on qt.id_tag=t.id" +
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
                                callback(null, rows);
                            }
                        }
                    }
                );
            }
        });
    }
}

module.exports = DAOTasks;