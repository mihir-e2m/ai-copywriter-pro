import { GoogleGenAI, Chat } from "@google/genai";
import type { FormState } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildPrompt(formData: FormState): string {
  return `
    Act as an expert copywriter. Your task is to generate content based on the following specifications.
    Topic / Subject: ${formData.topicSubject}
    Desired Tone: ${formData.tones.join(', ')}
    Target Audience: ${formData.audience.join(', ')}
    Key Points to Cover:
    ${formData.keyPoints}
    Approximate Length: ${formData.length} words.
    Optional SEO Keywords to include: ${formData.seoKeywords.join(', ')}
    
    Please generate the copy now. Ensure the output is well-structured and ready to use.
  `;
}

export async function generateCopy(formData: FormState): Promise<{ chat: Chat; firstMessage: string }> {
  const model = 'gemini-2.5-flash';
  
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: `You are a professional copywriter helping a user with their project on the topic: "${formData.topicSubject}".`,
    },
  });

  const prompt = buildPrompt(formData);
  const result = await chat.sendMessage({ message: prompt });
  const firstMessage = result.text;
  if (!firstMessage) {
    throw new Error("API returned no text in the response.");
  }
  return { chat, firstMessage };
}

export async function continueChat(chat: Chat, message: string): Promise<string> {
  const result = await chat.sendMessage({ message });
  const responseText = result.text;
  if (!responseText) {
    throw new Error("API returned no text in the response for chat continuation.");
  }
  return responseText;
}