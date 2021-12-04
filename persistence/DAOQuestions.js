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
                    "FROM (((question q left join question_tag qt on q.id=qt.id_question) left join tag t on qt.id_tag=t.id) join user u on q.id_user = u.id)" +
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
                                    if (element.tags !== null) element.tags = element.tags.split(',');
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
                    "FROM (((question q left join question_tag qt on q.id=qt.id_question) left join tag t on qt.id_tag=t.id) join user u on q.id_user = u.id)" +
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
                                    if (element.tags !== null) element.tags = element.tags.split(',');
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
    createQuestion(id, title, body, tags, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const query = "INSERT INTO `question` (`id_user`, `active`, `title`, `body`) VALUES " +
                    "(?,1,?,?)";
                connection.query(query, [id, title, body], (err, rows) => {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        //insertar las tag
                        let idQuestion = rows.insertId;
                        let sqlArray = tags.map(tag => "'" + tag + "'").join(',');
                        let query = "SELECT name FROM tag where name in (" + sqlArray + ")";
                        connection.query(query, (err, rows) => {
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            } else {
                                const newTags = tags.filter(t => !rows.includes(t));
                                if (newTags.length === 0) {
                                    let query = "SELECT id FROM tag where name in (" + sqlArray + ")";
                                    connection.query(query,
                                        (err, rows) => {
                                            if (err) {
                                                callback(new Error("Error de acceso a la base de datos"));
                                            } else {
                                                let task_tag = rows.map(row => [idQuestion, row.tagId]);
                                                connection.query("INSERT INTO question_tag (id_question, id_tag) VALUES ?", [task_tag],
                                                    (err, result) => {
                                                        connection.release();
                                                        if (err) {
                                                            callback(new Error("Error de acceso a la base de datos"));
                                                        } else {
                                                            callback(null);
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                } else {
                                    connection.query("INSERT INTO tag (name) VALUES ?", [newTags],
                                        (err, rows) => {
                                            if (err) {
                                                callback(new Error("Error de acceso a la base de datos"));
                                            } else {
                                                let query = "SELECT name FROM tag where name in (" + sqlArray + ")";
                                                connection.query(query,
                                                    (err, rows) => {
                                                        if (err) {
                                                            callback(new Error("Error de acceso a la base de datos"));
                                                        } else {
                                                            let task_tag = rows.map(row => [idTask, row.tagId, 1]);
                                                            connection.query("INSERT INTO question_tag (id_question, id_tag) VALUES ?", [task_tag],
                                                                (err, result) => {
                                                                    connection.release();
                                                                    if (err) {
                                                                        callback(new Error("Error de acceso a la base de datos"));
                                                                    } else {
                                                                        callback(null);
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        });
                        callback(null, rows);
                    }
                });
            }
        });
    }

    getQuestion(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const query = "SELECT q.id, q.id_user, q.title, q.body, q.views, q.date, q.likes, q.dislikes, GROUP_CONCAT(DISTINCT t.name) as tags, u.name, u.image " +
                    "FROM (((question q left join question_tag qt on q.id=qt.id_question) left join tag t on qt.id_tag=t.id) join user u on q.id_user = u.id)" +
                    "WHERE q.active = 1 AND q.id=? " +
                    " GROUP BY q.id ORDER BY q.date DESC";
                connection.query(query, [id], (err, rows) => {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        if (rows.length === 0) {
                            callback(null, null); //no hay preguntas
                        } else {
                            rows.forEach(element => {
                                element.dateAgo = timeUtils.getTimeAgo(element.date);
                                if (element.tags !== null) element.tags = element.tags.split(',');
                                element.shortBody = element.body.length > 150 ? element.body.substring(0, 150) + '...' : element.body;
                            });
                            connection.query()
                            callback(null, rows);
                        }
                    }
                });
            }
        });
    }

    getAnswers(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const query = "SELECT *, a.date as a_date " +
                    "FROM answer a join user u on a.user_id = u.id " +
                    "WHERE a.active = 1 AND a.question_id=? " +
                    "ORDER BY a.date DESC";

                connection.query(query, [id], (err, rows) => {
                    connection.release();
                    console.log(rows);
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        rows.forEach(element => {
                            element.dateAgo = timeUtils.getTimeAgo(element.a_date);
                        });
                        callback(null, rows);
                    }
                })
            }
        })
    }
    createAnswer(user_id, question_id, body, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const query = "INSERT INTO `answer` (`question_id`, `user_id`, `body`) VALUES " +
                    "(?, ?, ?)";
                connection.query(query, [question_id, user_id, body],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            callback(null, rows);
                        }
                    })
            }
        })
    }

    searchByText(search, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const query = "SELECT q.id, q.id_user, q.title, q.body, q.views, q.date, q.likes, q.dislikes, GROUP_CONCAT(DISTINCT t.name) as tags, u.name, u.image " +
                    "FROM (((question q left join question_tag qt on q.id=qt.id_question) left join tag t on qt.id_tag=t.id) join user u on q.id_user = u.id)" +
                    "WHERE q.active = 1 AND (q.title LIKE CONCAT('%',CONCAT(?,'%')) OR q.body LIKE CONCAT('%',CONCAT(?,'%')))" +
                    " GROUP BY q.id ORDER BY q.date DESC";
                connection.query(query, [search, search], (err, rows) => {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        rows.forEach(element => {
                            element.dateAgo = timeUtils.getTimeAgo(element.date);
                            if (element.tags !== null) element.tags = element.tags.split(',');
                            element.shortBody = element.body.length > 150 ? element.body.substring(0, 150) + '...' : element.body;
                        });
                        callback(null, rows);
                    }
                })
            }
        })
    }

    searchByTag(tag, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                const query = "SELECT q.id, q.id_user, q.title, q.body, q.views, q.date, q.likes, q.dislikes, GROUP_CONCAT(DISTINCT t.name) as tags, u.name, u.image " +
                    "FROM (((question q left join question_tag qt on q.id=qt.id_question) left join tag t on qt.id_tag=t.id) join user u on q.id_user = u.id)" +
                    " WHERE q.active = 1 AND q.id IN (SELECT id_question from question_tag sqt join tag st on st.id = sqt.id_tag WHERE st.name=?) " +
                    " GROUP BY q.id ORDER BY q.date DESC";
                connection.query(query, [tag], (err, rows) => {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        rows.forEach(element => {
                            element.dateAgo = timeUtils.getTimeAgo(element.date);
                            if (element.tags !== null) element.tags = element.tags.split(',');
                            element.shortBody = element.body.length > 150 ? element.body.substring(0, 150) + '...' : element.body;
                        });
                        callback(null, rows);
                    }
                })
            }
        })
    }
}




module.exports = DAOQuestions;