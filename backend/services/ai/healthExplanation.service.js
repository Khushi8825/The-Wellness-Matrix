const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateHealthExplanation = async (severity, reasons) => {
  const prompt = `
You are a calm and responsible health assistant.

Explain the user's health condition in very simple language.

Rules:
- Do NOT diagnose diseases
- Do NOT use medical jargon
- Do NOT scare the user
- Speak politely and clearly
- 3 to 4 short sentences only

Severity level: ${severity}

Reasons:
${reasons.map((r) => `- ${r}`).join("\n")}

End with gentle lifestyle advice.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You explain health data to users in simple, non-alarming language.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
  });

  return completion.choices[0].message.content;
};

module.exports = {
  generateHealthExplanation,
};
