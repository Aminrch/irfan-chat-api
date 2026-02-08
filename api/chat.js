import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { message } = req.body;

  // تشخیص Intent با AI
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages: [
      { role: "system", content: "You are an intent classifier. Reply with one word only." },
      {
        role: "user",
        content: `
Intents:
- beginner
- portfolio
- crypto
- book_call
- unknown

Message:
"${message}"
`
      }
    ]
  });

  const intent = completion.choices[0].message.content.trim();

  // جواب‌های از پیش تعیین‌شده
  const responses = {
    beginner: { text: "Great! Let’s start with the basics. Want to book a free call?" },
    portfolio: { text: "I can review your portfolio. Want to book a call?" },
    crypto: { text: "Crypto needs risk management. Want guidance?" },
    book_call: { text: "Perfect. Here’s the booking link.", link: "/book" },
    unknown: { text: "Can you tell me a bit more about your goal?" }
  };

  res.status(200).json(responses[intent] || responses.unknown);
}
