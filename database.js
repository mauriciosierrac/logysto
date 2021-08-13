const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(db => {
    console.log('DB Connected and already to use :) !!!')
})
.catch(err => console.log(err))