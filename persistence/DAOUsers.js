"use strict";

const mysql = require("mysql");
// var bcrypt = require('bcryptjs');
const helpers = require('../public/javascripts/helpers');

const timeUtils = require("../public/javascripts/timeUtils")
const multer = require('multer')
const upload = multer({ dest: '../public/images' })
class DAOUsers {
    constructor(pool) {
        this.pool = pool;
    }

    searchUserByString(searchQuery, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query(
                    "SELECT * FROM User WHERE name LIKE CONCAT('%',CONCAT(?,'%'));", [searchQuery],
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Couldn't get users"));
                        } else {
                            if (rows.length === 0) {
                                callback(null, rows);
                            } else {
                                let result = [];
                                rows.map(function(row) {
                                    result.push({ id: row.id, name: row.name, email: row.email, image: row.image, date: timeUtils.getTimeAgo(row.date), reputation: row.reputation, active: row.active });
                                })
                                callback(null, result)
                            }
                        }
                    }
                )
            }
        });
    }

    getAllUsers(callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Couldn't connect"));
            } else {
                connection.query(
                    "select * from user where active=1",
                    function(err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Couldn't get users"));
                        } else {
                            if (rows.length === 0) {
                                callback(null, false);
                            } else {
                                let result = [];
                                rows.map(function(row) {
                                    result.push({ id: row.id, name: row.name, email: row.email, image: row.image, date: timeUtils.getTimeAgo(row.date), reputation: row.reputation, active: row.active });
                                })
                                callback(null, result)
                            }
                        }
                    }
                )
            }
        })
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
                                // está mejor que devuelva true, y el usuario entero.
                                callback(null, { correct: true, user: rows[0] });
                            }
                        }
                    });
            }
        });
    }

    obtenerImagen(id, callback) {
            this.pool.getConnection(function(err, con) {
                if (err)
                    callback(err);
                else {
                    let sql = "SELECT user.image FROM user WHERE Id = ?";
                    con.query(sql, [id], function(err, result) {
                        con.release();
                        if (err) {
                            callback(err);
                        } else {
                            // Comprobar si existe una persona con el Id dado.
                            if (result.length === 0)
                                callback("No existe");
                            else
                                callback(null, result[0].image);
                        }
                    });
                }
            });
        }
        // [
        //     RowDataPacket {
        //       id: 1,
        //       date: 2021-11-08T23:00:00.000Z,
        //       email: 'nico@404.es',
        //       pass: '1234',
        //       image: 'nico.png',
        //       name: 'Nico',
        //       active: 1,
        //       reputation: 1
        //     }
        //   ]
    getUserId(email, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query(
                    "SELECT id FROM user WHERE email = ? ", [email],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        } else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario en la base de datos
                            } else {
                                var userId = rows[0].id;

                                callback(null, userId);
                            }
                        }
                    });
            }
        });
    }
    getUserbyEmail(email, callback) {
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
                                console.log(rows)
                                callback(null, rows);
                            }
                        }
                    });
            }
        });
    }
    getUserbyId(id, callback) {
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
                                let result = [];
                                rows.map(function(row) {
                                    result.push({ id: row.id, name: row.name, email: row.email, image: row.image, date: timeUtils.getTimeAgo(row.date), reputation: row.reputation, active: row.active });
                                })
                                callback(null, result);
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
        // vaya bicho de código 
    getMedals(email, callback) {
        const that = this;
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                that.getUserId(email, (err, result) => {
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    } else {
                        const sqlSearch = "SELECT u.id, u.name,m.name, m.metal, m.merit, m.type, m.active FROM user u join (medal m join user_medal um on id_medal=id) on id_user=u.id where u.id=?";
                        const searchQuery = mysql.format(sqlSearch, [result]);
                        connection.query(searchQuery, (err, result) => {
                            connection.release();
                            if (err) {
                                // aqui va entrar si el user no tiene medallas
                                console.log("No tiene medallas pelotudo")
                                callback(new Error("No hay medallas"));
                            } else {
                                console.log(result)

                                var arrayResult = [];
                                var arrayGold = [];
                                var arraySilver = [];
                                var arrayBronce = [];
                                // uuf estoy seguro de que esto se puede hacer más elegante, quiero pensarlo ahora? no.
                                result.map(m => {
                                    if (m.metal === "gold") {
                                        arrayGold.push({ id: m.id, name: m.name, metal: m.metal, merit: m.merit, type: m.type, active: m.active });
                                    } else if (m.metal === "silver") {
                                        arraySilver.push({ id: m.id, name: m.name, metal: m.metal, merit: m.merit, type: m.type, active: m.active });
                                    } else {
                                        arrayBronce.push({ id: m.id, name: m.name, metal: m.metal, merit: m.merit, type: m.type, active: m.active });
                                    }
                                });
                                arrayResult = {
                                    gold: arrayGold,
                                    silver: arraySilver,
                                    bronce: arrayBronce
                                };
                                callback(null, arrayResult);
                                //El usuario no tiene medallas 

                            }
                        })
                    }
                })
            }
        });
    }
    create(email, username, foto, password, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                throw (err);
            } else {

                var today = new Date();
                var _date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                const sqlInsert = "INSERT into user (`date`,`email`,`pass`,`image`,`name`,`active`,`reputation`) values (?,?,?,?,?,?,?)";
                const insert_query = mysql.format(sqlInsert, [_date, email, password, foto, username, 1, 0]);
                connection.query(insert_query, (err, result) => {
                    connection.release();
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result.insertId);
                    }
                });
            }
        });

    }

}

module.exports = DAOUsers;