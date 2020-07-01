const { Router } = require('express');
const jwt = require('jsonwebtoken');
const jwtSing = 'Acamica2020'
const router = Router();

let users = [
    {
        id: 1,
        nombre: "Gabriel123",
        apellido : "asd123",
        email: "lt.gabriel96@gmail.com",
        password : "pepito1",
        es_admin: true
    },
    {
        id: 2,
        nombre: "Gabriela123",
        apellido : "asd123",
        email: "lt.gabriela76@gmail.com",
        password : "pepito12",
        es_admin: false
    },
    {
        id: 3,
        nombre: "Gabrielita123",
        apellido : "asd123",
        email: "lt.gabrielita86@gmail.com",
        password : "pepito123",
        es_admin: false
    },
];

/// Función que evalua si existe el usuario
function validarUsuario(usuario, password){
    const userLogueado = users.find(user => user.nombre === usuario && user.password === password)
    if(userLogueado) {
        return true;
    } else {
        return false;
    }
}

/// Midleware para validación de rol del usuario
function isAdmin(req, res, next) { 
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verificarToken = jwt.verify(token, jwtSing);
        const userVerify = users.find(user => user.nombre == verificarToken.nombre);
        if(userVerify.es_admin === false) {
            console.log(userVerify.es_admin);
            res.status(403).send('Usuario sin permisos');
        } else {
            next()
        }
    } catch (err) {
        console.log(err);
    }
}

router.get('/', (req, res) => {
    res.status(200).send(users);
})

router.post('/', (req, res) => {
    const user = req.body;
    users.push(user);
    res.send(users);
})

router.put('/edit', (req, res) => {
    const newUser = req.body;
    const email = newUser.email;
    users = users.filter(user => user.email != email);
    users.push(newUser);
    res.send(users);
})

router.put('/set/:id', (req, res ) => {
    const idUser = req.params.id;
    const setUser = users.find(user => user.id == idUser);
    if(!setUser.hasOwnProperty('es_admin')){
        setUser.es_admin = false;
    } else {
        setUser.es_admin = !setUser.es_admin;
    }
    res.send(users);
})

router.post('/login', (req, res) => {
    const {nombre, password} = req.body;
    const isRegister = validarUsuario(nombre, password);
    if(!isRegister) {
        res.status(403).send('Usuario o contraseña incorrecta');
    } else {
    const token = jwt.sign({
        nombre
    }, jwtSing);
    res.json({token});
    }
})

router.post('/list', isAdmin,(req, res) => {
    res.status(200).send(users);
})

module.exports = router;