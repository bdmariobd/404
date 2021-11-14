const express = require('express');
const path = require('path');
const config = require('./config');
const session = require("express-session");
const mysql = require("mysql");

const mysqlSession = require("express-mysql-session");

const DAOUsers = require("./persistence/DAOUsers.js")

/* var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users'); */

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* app.use('/', indexRouter);
app.use('/users', usersRouter); */

const MySQLStore = mysqlSession(session);
const sessionStorage = new MySQLStore(config.mysqlConfig);

const middlewareSession = session({
    saveUninitialized: false,
    secret: "thisShouldBeEnvVariableLol05122000",
    resave: false,
    store: sessionStorage
});

app.use(middlewareSession);


// Crear el pool de conexiones 
const pool = mysql.createPool({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database,
});

let daoUser = new DAOUsers(pool);
//routes (TODO pasar a routers/controllers)

app.get("/", (request, response) => {
    response.status(200);
    response.render("index");
});

app.get("/login", (request, response) => {
    response.status(200);
    response.render("login");
});


app.post("/login", (request, response) => {
    daoUser.isUserCorrect(request.body.email, request.body.password,
        (err, rows) => {
            if (err) {
                response.status(500);
            } else {
                response.status(200)
                if (rows === null) {
                    console.log("Email/pass not valid");
                    response.render("login", null);
                } else {
                    request.session.currentUser = request.body.email;
                    console.log(request)
                    response.render("login", null);
                }
            }
        });

});
app.get("/signup", (request, response) => {
    response.status(200);
    response.render("signup");
});



app.listen(config.port, function(err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto " + config.port);
    }
});