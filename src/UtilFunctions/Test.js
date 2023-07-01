import React from 'react'
import { useState } from 'react'
import { useEffect, useRef } from 'react'
const Test = () => {
  
    const [name,setName]= useState('');
   
    const count = useRef(0);

    const input = useRef();
    
    useEffect(()=>{
        count.current=count.current+1;
        
    })

    return (
    <div>
        <input type="text" onChange={e=>{setName(e.target.value);
        input.current.focus() }
        }></input>
        <h1>{name}</h1>
        <h2>{count.current}</h2>
        <input ref={input} type='text'></input>
    </div>
  )
}

export default Test