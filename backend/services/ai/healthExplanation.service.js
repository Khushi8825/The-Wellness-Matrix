const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateHealthExplanation = async (severity, reasons, latestLog) => {
  const prompt = `
You are a health assistant.

Explain the user's health condition clearly and specifically using the actual numbers provided.

Current severity level: ${severity}

Reasons detected:
${reasons.join(", ")}

Latest readings:
Heart Rate: ${latestLog?.heart_rate} bpm
Systolic BP: ${latestLog?.systolic_bp} mmHg
Diastolic BP: ${latestLog?.diastolic_bp} mmHg
Blood Sugar: ${latestLog?.blood_sugar}

Do not give generic advice.
Base explanation on these numbers.
Keep it simple and non-alarming.
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
