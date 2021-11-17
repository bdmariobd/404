"use strict"

class DAOAnswers {
    constructor(pool) {
        this.pool = pool;
    }

    getAnswersByQuestion(question_id, callback) {
        this.pool.getConnection((err, connection) => {
            let sqlQuery = "SELECT * FROM answer WHERE question_id = ?";
            connection.query(sqlQuery, [question_id], (err, result) => {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                } else {
                    callback(null, result);
                }
            });
        });
    }
}

module.exports = DAOAnswers;