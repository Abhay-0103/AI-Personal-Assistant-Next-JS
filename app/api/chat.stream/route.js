import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
    try {
        const { message } = await request.json();

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const streamingResp = await model.generateContentStream(message);

        const encoder = new TextEncoder();

        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of streamingResp.stream) {
                    const text = chunk.text();
                    if (text) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`)
                        );
                    }
                }
                controller.close();
            },
        });

        return new Response(readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Gemini Streaming API Error:", error);
        return Response.json({ error: "Failed to process request" }, { status: 500 });
    }
}
