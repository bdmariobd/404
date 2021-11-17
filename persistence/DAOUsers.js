"use strict";

const mysql = require("mysql");
var bcrypt = require('bcryptjs');
class DAOUsers {
    constructor(pool) {
        this.pool = pool;
    }



    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query(
                    "SELECT * FROM user WHERE email = ? AND pass = ?", [email, password],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            } else {
                                callback(null, true);
                            }
                        }
                    });
            }
        });
    }

    userExistsbyId(id, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query(
                    "SELECT * FROM user WHERE id = ? ", [id],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario en la base de datos
                            } else {
                                callback(null, true);
                            }
                        }
                    });
            }
        });
    }
    userExists(email, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query(
                    "SELECT * FROM user WHERE email = ? ", [email],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario en la base de datos
                            } else {
                                callback(null, true);
                            }
                        }
                    });
            }
        });
    }

    create(email, username, password, callback) {
            this.pool.getConnection(async(err, connection) => {
                if (err) {
                    throw (err);
                }
                // TODO: HASH this que no funciona
                // var hashedPassword;
                // await bcrypt.hash(password, 10, function(err, hash) {
                //     // Store hash in your password DB.
                //     hashedPassword = hash;
                // });
                var today = new Date();
                var _date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                const sqlInsert = "INSERT into user (`date`,`email`,`pass`,`image`,`name`,`active`,`reputation`) values (?,?,?,?,?,?,?)";
                const insert_query = mysql.format(sqlInsert, [_date, email, password, "juanito", username, 1, 0]);
                connection.query(insert_query, (err, result) => {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        console.log(result.insertId);
                        callback(null, result.insertId);
                    }
                });

            });

        }
        /* getUserImageName(email, callback) {
            this.pool.getConnection(function(err, connection) {
                if (err) {
                    callback(new Error("Error de conexión a la base de datos"));
                } else {
                    connection.query(
                        "SELECT img FROM user WHERE email = ? ", [email],
                        function(err, rows) {
                            connection.release(); // devolver al pool la conexión
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            } else {
                                if (rows.length === 0) {
                                    callback(new Error("No existe el usuario")); //no está el usuario con el email proporcionado
                                } else {
                                    callback(null, rows[0].img);
                                }
                            }
                        });
                }
            });
        } */
}

module.exports = DAOUsers;