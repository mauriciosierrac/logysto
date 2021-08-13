const { Router } = require('express')
const router = Router()
const jwt = require('jsonwebtoken')


const User = require('../models/User')

router.post('/', async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({
        email: email
    })
   
    if(user === null){
        res.json({
            error: "User do not exists!"
        })
    } else {

        jwt.sign({ user: user }, 'secretkey', { expiresIn: '1d' }, (err, token) => {
            res.json({
                token: token
            })
        })
    }

})



module.exports = router