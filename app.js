var express = require('express');
var path = require('path');

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

app.listen(3000, function(err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});

app.get("/", (request, response) => {
    response.status(200);
    response.render("index");
});

app.get("/login", (request, response) => {
    response.status(200);
    response.render("login");
});