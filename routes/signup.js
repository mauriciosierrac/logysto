const { Router } = require('express')
const router = Router()


const User = require('../models/User')



// ruta de creacion de un usuario
router.post('/', async (req, res) => {
    const { name, email, password } = req.body
    const emailUser = await User.findOne({ email: email })

    if (emailUser == null) {
        const newUser = new User({ name, email, password })
        await newUser.save()
        res.json({
            messsage: 'New user created'
        })
        

    } else {
        res.json({
            message: "User already exists!"
        })
    }
})


module.exports = router

