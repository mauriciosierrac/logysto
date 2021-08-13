const { Router } = require('express')
const router = Router()
const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
require('dotenv').config()


//si el jwt es correcto el usuario puede acceder a la ruta para crear posts
router.post('/', verifyToken, (req, res) => {
    const apiKeyTomTom = process.env.API_KEY_TOMTOM
    const apiKeyGoogleMaps = process.env.API_KEY_GOOGLE
    const address = req.body.address
    const urlApiTomTom = `https://api.tomtom.com/search/2/search/${address}.json?lat=37.337&lon=-121.89&key=${apiKeyTomTom}`
    const urlApiGoogle = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKeyGoogleMaps}`
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            fetch(urlApiTomTom)
                .then(response => response.json())
                .then(data => {
                    const list = data.results
                    const coord = Object.values(list)[1].position
                    if (coord === '') {
                        fetch(urlApiGoogle)
                            .then(response => response.json())
                            .then(data => {
                                const list = data.results
                                const obj = Object.values(list)[0]
                                const coord = obj.geometry.location
                                res.json(coord)
                            })
                            .catch(error => console.log(error))
                    } else {
                        res.json(coord)
                    }
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



module.exports = router