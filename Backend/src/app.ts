
import express from 'express'
import graph from './ai/graph.ai.js'
import { success } from 'zod'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.get('/',async(req,res)=>{

    const result = await graph("write a code factorial")
    
    console.log(result)
})

app.post('/invoke',async(req,res)=>{

    const {input} = req.body

    const result = await graph(input)

    res.status(201).json({
        message :"Graph executed sucessfully",
        success:true,
        result 
    })

})

export default app