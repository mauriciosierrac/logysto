const express = require('express')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')

const app = express()

//definimos nuestras heramientas a usar, para el manejo de json
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

//definimos una ruta inicial solo para testear el funcionamiento de la API
app.get('/api', (req, res) => {
    res.json({
        mensaje: 'Hello, It works with Nodejs and jwt'
    })
})


//el usuario accede a la ruta login y la API devuelve un jwt
//el objeto usuario esta contenido en una variable llamada user
app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        nombre: 'user',
        email: 'user01@mail.com'
    }

    jwt.sign({ user: user }, 'secretkey', { expiresIn: '1d' }, (err, token) => {
        res.json({
            token: token
        })
    })

})


//si el jwt es correcto el usuario puede acceder a la ruta para crear posts
app.post('/api/post', verifyToken, (req, res) => {
    const apiKey = '1A6jPSfxQ0Eu4dsgM7m26DUMxo9tEa3p'
    const address = req.body.address
    const urlApiTomTom = `https://api.tomtom.com/search/2/search/${address}.json?lat=37.337&lon=-121.89&key=${apiKey}`
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            fetch(urlApiTomTom)
                .then(response => response.json())
                .then(data => {
                    res.json(data)
                })
                .catch(error => console.log(error))
        }

    })
})

//funcion que verifica si el usuario envia un token en los headers, en caso de ser negativo responde con estado (403) prohibido
// Authorization: Bearer <token>
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(403)
    }
}




//ponemos el servidor express a escuchar el puerto 4000
app.listen(4000, () => {
    console.log("Server Running in port 4000")
})