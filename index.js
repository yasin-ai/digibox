const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const homeRoutes = require('./routes/route')
const loginRoutes = require('./routes/route')
const signupRoutes = require('./routes/route')

const app = express();
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));

app.use(homeRoutes)
app.use(loginRoutes)
app.use(signupRoutes)

app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, console.log("listening"));