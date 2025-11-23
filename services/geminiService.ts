import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

const model = 'gemini-2.5-flash';

export function createChatSession(systemInstruction: string): Chat {
  if (!ai) {
    throw new Error("API_KEY environment variable not set. Please set GEMINI_API_KEY in .env");
  }
  return ai.chats.create({
    model: model,
    config: {
      systemInstruction,
    },
  });
}

export async function continueChat(chat: Chat, message: string): Promise<string> {
  const result = await chat.sendMessage({ message });
  const responseText = result.text;
  if (!responseText) {
    throw new Error("API returned no text in the response for chat continuation.");
  }
  return responseText;
}