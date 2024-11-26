const express = require('express')
const {Mistral} = require( '@mistralai/mistralai')
const {RecursiveCharacterTextSplitter}= require( 'langchain/text_splitter')
require('dotenv').config()
const {createClient} = require('@supabase/supabase-js')
const crypto = require('crypto')

const id = crypto.randomUUID()
// console.log('random id ' , id)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseApiKey = process.env.SUPABASE_API_KEY

const supabase = createClient(supabaseUrl,supabaseApiKey)

const splitter =new RecursiveCharacterTextSplitter({
    chunkSize:250,
    chunkOverlap:50
})
 
const mistralClient = new Mistral({apiKey:process.env.MISTRAL_API_KEY})

async function sendEmbedding(req,res){
    //GETTING UPLOADED FILE
        const {file}= req.body
    if(file){
        // console.log('File: ', file)
        //CHUNKING FILE
        const chunks = await splitter.createDocuments([file])
        const content = chunks.map(chunk => chunk.pageContent)

        //EMBEDDING CHUNK
        const vectorData =await mistralClient.embeddings.create(
            {
                model:'mistral-embed',
                inputs:content
            }
            
        )
        const contentVector = vectorData.data.map((datum,index) => ({content:content[index],embedding:datum.embedding,bookid:id}))
        //UPLOADING TO SUPABASE
        const {statusText} = await supabase.from('bookembeddings').insert(contentVector)
       
       
        console.log("Supabase : ", statusText )
        return res.status(200).json({text:'sending Embeddings'})
    }


}
async function getContent(req,res){
   const {query} = req.body
   const embedding = await mistralClient.embeddings.create({
    model:'mistral-embed',
    inputs:[query]
   })
  const  embeddingVectorData = embedding.data[0].embedding
//    console.log("Query: ",query)
//    console.log("emedding: ",embeddingVectorData)
           //GETTING CONSINE SIMILARITY
          const  matchData =await supabase.rpc('match_bookembeddings',{
            query_embedding:embeddingVectorData,
            match_threshold:0.78,
            match_count:5
        })

        const context = matchData.data.map(datum=> datum.content).join('')
        //GETTING RESPONSE FROM MISTRAL
        
        const response = await mistralClient.chat.complete({
            model:'mistral-tiny',
            messages:[{
                role:'user',
                content:`context:${context} based on the context answer this query query:${query}`
            }]
        })
        const textResponse = response.choices[0].message.content
        // console.log("response  ",response.choices[0].message.content)
        return res.status(200).json({text:textResponse})
}

module.exports={sendEmbedding, getContent}
