const express = require('express')
const router = express.Router()
const {getContent,sendEmbedding} = require('../controllers/generationController')

//SEND CHUNK EMBEDDING AND CONTENT

 router.post('/upload', sendEmbedding)

 //GET CONSINE SIMILARITY 

 router.post('/query', getContent)

 module.exports= router