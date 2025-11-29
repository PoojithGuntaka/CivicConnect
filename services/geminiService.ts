import { GoogleGenAI, Type } from "@google/genai";
import { Issue, SentimentReport } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const chatWithAssistant = async (message: string, history: string[]): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful, neutral, and informative virtual assistant for the "CivicConnect" government platform. 
    Your goal is to help citizens understand services, report issues, and participate in governance. 
    Keep answers concise (under 100 words) unless asked for details. 
    If you don't know a specific policy, advise them to contact the city clerk.`;

    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: 'user', parts: [{ text: `Context History: ${history.join('\n')}` }] },
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        maxOutputTokens: 300,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I am currently experiencing high traffic. Please try again later.";
  }
};

export const analyzeConstituentSentiment = async (issues: Issue[]): Promise<SentimentReport> => {
  try {
    const issueTexts = issues.map(i => `Title: ${i.title}. Description: ${i.description}. Category: ${i.category}`).join('\n---\n');
    
    const prompt = `Analyze the following list of citizen grievances/issues. 
    Determine the overall public sentiment, a satisfaction score (0-100 where 100 is perfect happiness, 0 is angry), 
    identify 3 key recurring themes, and write a brief 1-sentence executive summary for the Mayor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: issueTexts }] },
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSentiment: { type: Type.STRING, enum: ['positive', 'neutral', 'negative'] },
            score: { type: Type.NUMBER },
            keyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ['overallSentiment', 'score', 'keyThemes', 'summary']
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    
    return JSON.parse(jsonText) as SentimentReport;

  } catch (error) {
    console.error("Gemini Sentiment Error:", error);
    // Fallback data
    return {
      overallSentiment: 'neutral',
      score: 50,
      keyThemes: ['Infrastructure', 'Delays', 'Maintenance'],
      summary: 'Automated analysis unavailable; please review raw data.'
    };
  }
};