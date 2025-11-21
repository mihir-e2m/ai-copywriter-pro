import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

export function createChatSession(systemInstruction: string): Chat {
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