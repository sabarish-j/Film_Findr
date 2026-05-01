const { GoogleGenerativeAI } = require('@google/generative-ai');

let _model = null;

function getModel() {
  if (_model) return _model;
  const key = process.env.GOOGLE_GEMINI_API_KEY;
  if (!key) throw new Error('GOOGLE_GEMINI_API_KEY is not set');
  const genAI = new GoogleGenerativeAI(key);
  _model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.6,
      topP: 0.9,
      maxOutputTokens: 600,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  });
  return _model;
}

async function* streamChat({ systemPrompt, userPrompt, history = [] }) {
  const model = getModel();
  const chat = model.startChat({
    systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
    history: history
      .filter((h) => h && h.content)
      .map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
  });

  const result = await chat.sendMessageStream(userPrompt);
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

module.exports = { streamChat };
