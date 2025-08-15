/*
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY,
});

export async function POST(request){
    try {
     const {message} = await request.json()

     const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{role: 'user', content: message}]
     })

     return Response.json({
        response : completion.choices[0].message.content
     });
    } catch (error) {
        return Response.json({
            error : "Failed to process ",
        },
        {status:500}
        )
    }
}
*/

import { GoogleGenerativeAI } from "@google/generative-ai";

// Use environment variable for safety
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { message } = await request.json();

    // Load the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Send prompt to Gemini
    const result = await model.generateContent(message);

    // Extract plain text
    const responseText = result.response.text();

    return Response.json({
      response: responseText
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
