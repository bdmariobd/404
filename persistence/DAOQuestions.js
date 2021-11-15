"use strict"


class DAOTasks {
    constructor(pool) {
        this.pool = pool;
    }

    /*     // El método getAllTasks(email, callback) devuelve todas las tareas asociadas a un determinado usuario de la
        // BD junto con los tags asociados a cada una de ellas. En la implementación de este método se debe utilizar
        // una única consulta que relacione las tablas tasks y tag, y reconstruir el resultado a partir de esta consulta. El
        // resultado de esta operación es un array de tareas, siendo cada una de ellas un objeto con cuatro propiedades:
        // id, text, done y tags. La última de ellas, tags, es un array con las etiquetas asociadas a la tarea.

        getAllQuestions(email, callback) {
            this.pool.getConnection(function(err, connection) {
                if (err) {
                    callback(new Error("Error de conexión a la base de datos"));
                } else {
                    connection.query(
                        "SELECT tk.id, tk.text, tk.done, GROUP_CONCAT(DISTINCT tg.tag) as tags  FROM ((task tk join tag_task tgtk on tk.id=tgtk.taskId) join tag tg on tg.tagId = tgtk.tagId) WHERE user = ? GROUP BY tk.id", [email],
                        function(err, rows) {
                            connection.release(); // devolver al pool la conexión
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            } else {
                                if (rows.length === 0) {
                                    callback(new Error("El usuario no tiene tareas o no existe")); // ese usuario no tiene task
                                } else {
                                    let taskArray = [];
                                    //ARREGLAR ESTO, ME DEVUELVE 
                                    rows.forEach(r => {
                                        taskArray.push({ id: r.id, text: r.text, done: r.done, tags: r.tags.split(',') })
                                    });
                                    //{ text: "prueba", done: 0, tags: ["primera", "segunda"] }
                                    callback(null, taskArray);
                                }
                            }
                        }
                    );
                }
            });
        }

        //método auxiliar para checkear si existe una tag already exists
        tagAlready(tag, callback) {
            this.pool.getConnection(function(err, connection) {
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                } else {
                    connection.query("Select * FROM tag where tag=?", [tag],
                        function(err, result) {
                            connection.release();
                            if (err) {
                                callback(err);
                            } else {
                                if (result.length === 0) {
                                    callback(null, -1);
                                } else {
                                    callback(null, result[0].id);
                                }
                            }
                        }
                    );
                }
            })
        }

        insertTask(email, task, callback) {
            var that = this;
            this.pool.getConnection(function(err, connection) {
                if (err) {
                    callback(new Error("Error de conexión a la base de datos"));
                } else {
                    connection.query(
                        "INSERT INTO task (user, text, done, active) VALUES (?,?,?,?)", [email, task.text, task.done, 1],
                        (err, result) => {
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            } else {
                                let idTask = result.insertId;
                                let sqlArray = task.tags.map(tag => "'" + tag + "'").join(',');
                                let query = "SELECT tag FROM tag where tag in (" + sqlArray + ")";
                                connection.query(query,
                                    (err, rows) => {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        } else {

                                            let parsedTags = []
                                            rows.forEach(row => parsedTags.push(row.tag));
                                            console.log(task)
                                            let newTags = task.tags.filter(t => !parsedTags.includes(t));
                                            newTags = newTags.map(t => [t, 1]);
                                            if (newTags.length === 0) {
                                                let query = "SELECT tagId FROM tag where tag in (" + sqlArray + ")";
                                                connection.query(query,
                                                    (err, rows) => {
                                                        if (err) {
                                                            callback(new Error("Error de acceso a la base de datos"));
                                                        } else {
                                                            let task_tag = rows.map(row => [idTask, row.tagId, 1]);
                                                            connection.query("INSERT INTO tag_task (taskId, tagId, active) VALUES ?", [task_tag],
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
                                                connection.query("INSERT INTO tag (tag,active) VALUES ?", [newTags],
                                                    (err, rows) => {
                                                        if (err) {
                                                            callback(new Error("Error de acceso a la base de datos"));
                                                        } else {
                                                            let query = "SELECT tagId FROM tag where tag in (" + sqlArray + ")";
                                                            connection.query(query,
                                                                (err, rows) => {
                                                                    if (err) {
                                                                        callback(new Error("Error de acceso a la base de datos"));
                                                                    } else {
                                                                        let task_tag = rows.map(row => [idTask, row.tagId, 1]);
                                                                        connection.query("INSERT INTO tag_task (taskId, tagId, active) VALUES ?", [task_tag],
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
                                    }
                                );
                            }
                        }
                    );
                }
            });
        }

        markTaskDone(idTask, callback) {
            this.pool.getConnection(function(err, connection) {
                if (err) {
                    callback(new Error("Error de conexión a la base de datos"));
                } else {
                    connection.query('UPDATE task SET done = true WHERE id = ?', [idTask], function(err, result) {
                        connection.release(); // devolver al pool la conexión

                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            //segun el pdf no debe imprimir nada, cambiar
                            callback(null);
                        }
                    })
                }
            });
        }

        deleteCompleted(email, callback) {
            this.pool.getConnection(function(err, connection) {
                if (err) {
                    callback(new Error("Error de conexión a la base de datos"));
                } else {
                    connection.query('UPDATE task SET task.active = 0 WHERE task.user = ? AND task.done=true', [email], function(err, result) {
                        connection.release(); // devolver al pool la conexión

                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            //segun el pdf no debe imprimir nada, cambiar
                            callback(null);
                        }
                    })
                }
            });
        } */


}

module.exports = DAOTasks;