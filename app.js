const express = require('express');
const path = require('path');
const config = require('./config');
const session = require("express-session");

const morgan = require("morgan")

const mysqlSession = require("express-mysql-session");

var indexRouter = require('./routes/indexRouter');
var usersRouter = require('./routes/usersRouter');
var questionRouter = require('./routes/questionsRouter');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
//necesario para formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



const MySQLStore = mysqlSession(session);
const sessionStorage = new MySQLStore(config.mysqlConfig);

const middlewareSession = session({
    saveUninitialized: false,
    secret: "thisShouldBeEnvVariableLol05122000",
    resave: false,
    store: sessionStorage
});

//middleware que imprime las peticiones
app.use(morgan("dev"));

app.use(middlewareSession);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/preguntas', questionRouter);








app.listen(config.port, function(err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto " + config.port);
    }
});