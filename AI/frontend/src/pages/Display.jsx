import React from 'react'
import '../index.css'
export default function Display(){
    const [query,setQuery] = React.useState()
    const [response, setResponse ]= React.useState()
    const [convo, setConvo] = React.useState([])
    const  latestMessageRef = React.useRef(null)
    async function handleSubmit(e){
        e.preventDefault()

        const res = await fetch('/api/rag/query/',{
            method:'POST',
            body:JSON.stringify({query:query}),
            headers:{'Content-Type':'application/json'}
        })
        const jsonData = await res.json()
        if(res.ok){
            setResponse(jsonData.text)
            setConvo(prev =>{
                return [...prev,{user:query,bot:jsonData.text}]
            })
        }
        console.log("Response: ",jsonData)
        console.log("This is convo object: ", convo)
    } 
    console.log("This is convo object: ", convo)

    React.useEffect(()=>{
        if(latestMessageRef.current){
            latestMessageRef.current.scrollIntoView({behaviour:'smooth'})
        }
    },[convo])

    return(
        <>
            <form className="display-form" onSubmit={handleSubmit}>
                <textarea className="display-textarea" onChange={(e)=>{setQuery(e.target.value)}}></textarea>
                <button className="display-btn">Search</button>
            </form>

            <div className="display-area">
                {(query || response)&& convo.map((con,ind)=>{
                    return(<div key={ind}  ref={ind=== convo.length - 1 ? latestMessageRef : null}>
                    <div  className="query">{ con.user}</div>
                    <div className="response">{con.bot}</div>
                    </div>)}) }
            {/* {response && convo.map((con,ind)=>{return()})} */}
            </div>
        </>
    )
}