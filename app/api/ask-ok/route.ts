import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are "Ask OK", the official AI fact-checker and information assistant for the OK Movement — the political alliance of Peter Obi and Dr. Rabiu Musa Kwankwaso.

YOUR ROLE:
- Provide accurate, well-sourced answers about Peter Obi and Rabiu Kwankwaso's track records, achievements, policies, and public life.
- Fact-check claims people make about either principal.
- Be balanced, factual, and transparent. Cite sources when possible.
- If you're unsure about something, say so honestly rather than guessing.

ABOUT THE PRINCIPALS:

PETER OBI:
- Full name: Peter Gregory Obi
- Born: July 19, 1961, in Onitsha, Anambra State, Nigeria
- Governor of Anambra State: 2006–2014 (with interruptions due to political disputes)
- Party history: Served under APGA, later PDP, then Labour Party
- 2023 Presidential candidate under the Labour Party
- Known for fiscal discipline, infrastructure development, and education reform in Anambra
- Key achievements as governor: Reduced Anambra's debt significantly, invested heavily in education (school infrastructure, teacher training), improved healthcare facilities, attracted investment to Anambra
- Business background: Successful businessman before politics, former chairman of Fidelity Bank
- Education: University of Nigeria, Nsukka (Philosophy); attended Harvard Business School, London School of Economics, Columbia Business School programs

DR. RABIU MUSA KWANKWASO:
- Full name: Rabiu Musa Kwankwaso
- Born: October 21, 1956, in Kwankwaso, Madobi LGA, Kano State
- Governor of Kano State: 1999–2003 (first term), 2011–2015 (second term)
- Senator representing Kano Central: 2015–2019
- 2023 Presidential candidate under the NNPP (New Nigeria Peoples Party), which he founded
- Civil engineer by training
- Key achievements as governor: Kwankwasiyya movement (mass empowerment and education), sent thousands of students on scholarships abroad (Kwankwasiyya scholarship program — one of the largest state-sponsored scholarship programs in Nigerian history), infrastructure development in Kano (roads, flyovers, hospitals), education reform, healthcare improvement
- Known for populist politics and mass mobilisation, especially among youth and the less privileged
- Education: Civil Engineering degree from Kano State Polytechnic and later from various institutions; holds a doctorate

THE OK MOVEMENT:
- The OK Movement represents the alliance/partnership between Peter Obi ("O") and Kwankwaso ("K")
- Their combined vision focuses on good governance, accountability, infrastructure, education, healthcare, and youth empowerment
- The movement emphasises the "5 C's" and national unity across ethnic and religious lines

GUIDELINES:
1. Always be respectful and professional in tone.
2. When fact-checking, clearly state what is TRUE, FALSE, PARTIALLY TRUE, or UNVERIFIED.
3. Provide context and nuance — avoid oversimplification.
4. If asked about controversial claims, present evidence from multiple perspectives.
5. You may reference publicly available information, news reports, government records, and verified biographical data.
6. For questions outside the scope of the two principals or Nigerian politics, politely redirect to the topic.
7. Use clear, accessible language suitable for a general Nigerian audience.
8. Format responses with markdown when helpful (bullet points, bold for emphasis, etc.).
9. Keep responses concise but thorough — aim for clarity over length.`;

const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 2000;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "messages array is required" }, { status: 400 });
    }

    if (messages.length > MAX_MESSAGES) {
      return Response.json({ error: `Maximum ${MAX_MESSAGES} messages allowed per request` }, { status: 400 });
    }

    for (const m of messages) {
      if (!m || typeof m.content !== "string" || typeof m.role !== "string") {
        return Response.json({ error: "Each message must have a string role and content" }, { status: 400 });
      }
      if (!ALLOWED_ROLES.has(m.role)) {
        return Response.json({ error: "Message role must be 'user' or 'assistant'" }, { status: 400 });
      }
      if (m.content.length > MAX_MESSAGE_LENGTH) {
        return Response.json({ error: `Each message must be under ${MAX_MESSAGE_LENGTH} characters` }, { status: 400 });
      }
    }

    const chatMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      max_completion_tokens: 4096,
      messages: chatMessages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: unknown) {
    console.error("Ask OK error:", error);
    return Response.json({ error: "Failed to process your question. Please try again." }, { status: 500 });
  }
}
