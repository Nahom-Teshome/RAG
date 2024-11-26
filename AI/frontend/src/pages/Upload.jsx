import React from 'react'
import { FaRegFileAlt } from "react-icons/fa";
export default function Upload(){
    const [file,setFile] = React.useState(null)
     function handleFileChange(e){
        const newFile = e.target.files[0]
        console.log(newFile)
        
        if(newFile){
            const reader = new FileReader()
            reader.onload= (event)=>{
                setFile(event.target.result)
                console.log("Result",event.target.result)
            }
            reader.readAsText(newFile)  
        }
        }

       async function handleSubmit(e){
        e.preventDefault()
        const res = await fetch('/api/rag/upload/',{
            method:'POST',
            body: JSON.stringify({file:file}),
                headers:{
                    'Content-Type':'application/json'
                }
        })
        if(!res.ok){
            throw new Error("NEW ERROR")
        }
        const jsonData =await res.json()
        console.log("Response from backend ", jsonData)
       } 

return(
    <div className="upload-container">
        <form className="upload-form" onSubmit={handleSubmit} >
            <input className="upload-input" type="file" onChange={(e)=>{handleFileChange(e)}} />
            <button className="upload-btn"><FaRegFileAlt /></button>
        </form>
    </div>
)

}