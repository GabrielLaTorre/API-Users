const express = require('express');
const app = express();
const users = require('./users');
const body_parser = require('body-parser');

app.use(body_parser.json());
app.use('/user', users);

app.listen('3000', () => {
    console.log("Servidor corriendo!");
})