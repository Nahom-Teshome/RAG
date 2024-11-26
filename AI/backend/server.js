const express = require('express')
const app = express()
const generationRoutes = require('./routes/generationRoutes')

app.listen('3000',()=>{
    console.log("listening on port 3000")
})

app.use(express.json())
app.use((req,res,next)=>{
    next()
})

app.use('/api/rag/',generationRoutes )