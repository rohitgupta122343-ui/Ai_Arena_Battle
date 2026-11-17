
import { config } from "dotenv";
config()



const app_config = {

    GEMINI_API_KEY:process.env.GEMINI_API_KEY || "" ,
    COHERE_API_KEY:process.env.COHERE_API_KEY || "",
    GROQ_API_KEY:process.env.GROQ_API_KEY || ""

}

export default app_config

