import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.JUDGE_MODEL ?? 'gemini-3.1-flash-lite';
const criterion = {
  type: 'object',
  properties: {
    pass: { type: 'boolean' },
    confidence: { type: 'number' },
    reason: { type: 'string' },
  },
  required: ['pass', 'confidence', 'reason'],
};

const SCHEMA = {
  type: 'object',
  properties: {
    intent: criterion,
    coherence: criterion,
    preservation: criterion,
    meaningfulChange: criterion,
  },
  required: ['intent', 'coherence', 'preservation', 'meaningfulChange'],
};

const SYSTEM = `You evaluate an AI script-rewriting feature.
Given ORIGINAL script, USER PROMPT, and MODIFIED script, judge these criteria:
- intent: does the modified script reflect the prompt's intent?
- coherence: is it fluent and grammatically correct?
- preservation: does it keep the core information of the original?
- meaningfulChange: is it meaningfully different, not a trivial reword?
confidence is your certainty in that verdict, 0.0-1.0. Keep each reason under 10 words.`;

export async function judge(original: string, prompt: string, modified: string) {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: `USER PROMPT:\n${prompt}\n\nORIGINAL:\n${original}\n\nMODIFIED:\n${modified}`,
    config: {
      systemInstruction: SYSTEM,
      temperature: 0,
      responseMimeType: 'application/json',
      responseSchema: SCHEMA,
    },
  });

  return JSON.parse(res.text ?? '{}');
}
