const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateHealthExplanation = async (severity, reasons, healthLogs) => {
  const healthData = healthLogs.map((log) => ({
    date: log.log_date,
    heartRate: log.heart_rate,
    systolicBloodPressure: log.systolic_bp,
    diastolicBloodPressure: log.diastolic_bp,
    bloodSugar: log.blood_sugar,
    sleepHours: log.sleep_hours,
    weight: log.weight,
    meals: log.meals,
  }));

  const prompt = `You are an experienced physician, cardiologist, sleep specialist and nutrition expert.

Analyze the following user's health data collected over the last 30 days.

Health Data:
${JSON.stringify(healthData, null, 2)}

Current rule-based status: ${severity}
Detected reasons: ${reasons.join(", ")}

Provide a personalized health report in simple, human-friendly language. Return clean Markdown with headings and bullet points. Include these sections:
1. Overall Health Summary
2. Heart Rate Analysis
3. Blood Pressure Analysis
4. Sleep Analysis
5. Health Trends
6. Possible Risks
7. Exercise Recommendations
8. Diet Recommendations
9. Lifestyle Improvements
10. Positive Observations

Discuss risks such as hypertension, stress, fatigue, recovery, cardiovascular risk, sleep deficiency, and lifestyle concerns only when supported by the data. Do not create unnecessary panic. State clearly that this is not a medical diagnosis. Mention walking, cardio, strength training, stretching, daily duration and weekly frequency where appropriate. Include hydration, salt, sugar, protein, fruits and vegetables in diet guidance. End with a short, supportive motivational paragraph.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You provide careful, supportive, evidence-aware health education. You never diagnose." },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
  });

  return completion.choices[0]?.message?.content || "No AI analysis was returned. Please try updating your vitals again.";
};

module.exports = { generateHealthExplanation };
