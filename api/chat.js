import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight request handling
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    // AI response
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are the AI assistant for irfaninvest.com.

⚠️ Important:
- Never give financial, legal, or investment advice.
- Always include a disclaimer if user asks anything about investments.
- Direct users to book a free consultation for specific advice.

Goals:
- Qualify leads
- Encourage booking a free consultation
- Keep answers short, friendly, and professional

Tone:
- Confident, clear, and approachable
- Avoid any promises or guarantees
- Focus on general guidance only
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    // Get AI answer
    const aiText = completion.choices[0].message.content;

    // Quick Replies Example (adjust based on your business logic)
    const buttons = [
      { label: "Book a Free Call", action: "I want to book a free call" },
      { label: "Learn Basics", action: "Tell me about the basics" }
    ];

    res.status(200).json({
      text: aiText,
      buttons: buttons
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ text: "Oops! Something went wrong." });
  }
}
