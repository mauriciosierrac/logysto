const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
require('./database')

const app = express()


//definimos nuestras heramientas a usar, para el manejo de json
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', process.env.PORT || 5000)


//definimos una ruta inicial solo para testear el funcionamiento de la API
app.get('/api', (req, res) => {
    res.json({
        mensaje: 'Hello, It works with Nodejs and jwt'
    })
})

//routes
app.use('/api/signup', require('./routes/signup'))
app.use('/api/login', require('./routes/login'))
app.use('/api/address', require('./routes/address'))


//ponemos el servidor express a escuchar el puerto 4000
app.listen(app.get('port'), () => {
    console.log(`Server Running in port ${app.get('port')}`)
})