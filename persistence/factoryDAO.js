"use strict"

const mysql = require("mysql");
const config = require('../config');

const DAOUsers = require("../persistence/DAOUsers");
const DAOQuestions = require("../persistence/DAOQuestions");



const pool = mysql.createPool({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database,
});

const daousers = new DAOUsers(pool);
const daoquestion = new DAOQuestions(pool);

module.exports = {
    getDAOUsers: function getDAOUsers() {
        return daousers;
    },
    getDAOQuestions: function getDAOQuestions() {
        return daoquestion;
    }
}