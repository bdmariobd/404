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
                                    callback(null, null); //no está el usuario con el password proporcionado
                                } else {
                                    callback(null, rows);
                                }
                            }
                        });
                }
            });
        }
        //TODO: FUNCIONA, PERO HAY QUE IMPLEMENTAR LOS CÓDIGOS EN APP.JS (res 409 (conflicto ya inserta), y el 201, insertado)
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
                const sqlCheck = "SELECT  * FROM user WHERE email = ?";
                const check_query = mysql.format(sqlCheck, [email]);
                const sqlInsert = "INSERT into user (`date`,`email`,`pass`,`image`,`name`,`active`,`reputation`) values (?,?,?,?,?,?,?)";
                const insert_query = mysql.format(sqlInsert, [_date, email, password, "juanito", username, 1, 0]);
                await connection.query(check_query, async(err, result) => {
                    if (err) {
                        throw (err);

                    }
                    if (result.length != 0) {
                        connection.release();
                        console.error("Existe este usuario")
                    } else {
                        await connection.query(insert_query, async(err, result) => {
                            connection.release();
                            if (err) throw (err);
                            console.log(result.insertId)

                        })
                    }
                })
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