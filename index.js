const http = require('http');
const dotenv = require('dotenv');

const path = require('path');
const url = require('url');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');

const routes = require(`./routes/routes.js`);
const db = require(`./models/db.js`);

const update = require('./public/scripts/updateApp.js');

dotenv.config();
port = process.env.PORT;
hostname = process.env.HOSTNAME;

const app = express();
app.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(`/`, routes);
app.use(cookieParser());

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

db.connect();

app.listen(port, hostname, function () {
    console.log('Server running at:');
    console.log('http://' + hostname + ':' + port);
});

// configure user session
app.use(session({
    key: 'saved_username',
    secret:'somesecret',
    resave: false,
    saveUninitialized: false,
    rolling: true,      // refresh cookie age
    cookie: {
        maxAge: 12096e5 // two weeks
    }
}));

update.updateAchievements();