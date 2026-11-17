
import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue,type GraphNode, StateGraph, START, END } from "@langchain/langgraph";
import {z} from 'zod'
import { geminiModel2,cohereModel,geminiModel1 } from "./model.service.js";
import { createAgent,providerStrategy } from "langchain";

const State = new StateSchema({
    messages : MessagesValue,

    solution_1:new ReducedValue(z.string().default(""),{
        reducer:(current,next)=>{
            return next
        }
    }),

    solution_2:new ReducedValue(z.string().default(""),{
        reducer:(current,next)=>{
            return next
        }
    }),

    judge_recommendation: new ReducedValue(z.object({
         solution_1_score:z.number(),
        solution_2_score:z.number()
    }).default({
        solution_1_score:0,
        solution_2_score:0
    }),{
        reducer:(current,next)=>{
            return next
        }
    })

})

const soultionNode:GraphNode<typeof State> = async(state:typeof State)=>{

    console.log(state.messages)

    const [geminiSolution,cohereSolution] = await Promise.all([
        geminiModel2.invoke(state.messages[0].text),
        cohereModel.invoke(state.messages[0].text)
    ])

    return {
        solution_1:geminiSolution.text,
        solution_2:cohereSolution.text
    }
}

const judgeNode: GraphNode<typeof State> = async (state) => {

    console.log("Judge Node Called")

    console.log("Solution 1:", state.solution_1)
    console.log("Solution 2:", state.solution_2)


    const { solution_1, solution_2 } = state

    const judge = createAgent({
        model: geminiModel1,
        tools: [],
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10)
        }))
    })

    const judgeResponse = await judge.invoke({
        messages: [
            new HumanMessage(`
                Compare both AI solutions.

                Solution 1:
                ${solution_1}

                Solution 2:
                ${solution_2}

                Evaluate accuracy, quality and completeness.
                Give both solutions a score between 0 and 10.
            `)
        ]
    })

    console.log("FULL JUDGE:", judgeResponse)
console.log("STRUCTURED:", judgeResponse.structuredResponse)

    return {
        judge_recommendation: judgeResponse.structuredResponse
    }
}
const graph = new StateGraph(State)
    .addNode("solution",soultionNode)
    .addNode("judge",judgeNode)
    .addEdge(START,"solution")
    .addEdge("solution","judge")
    .addEdge("judge",END)
    .compile()


export default async  function(userMessage:string){
        const result = await graph.invoke({
            messages:[
                new HumanMessage(userMessage)
            ]
        })

        console.log(result)

        return result.messages
}
