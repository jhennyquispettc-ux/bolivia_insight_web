import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async sendMessage(history: { role: string; parts: { text: string }[] }[], message: string) {
    if (!this.genAI) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not configured in the backend.');
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: "You are Wara, a friendly and knowledgeable AI concierge for 'Bolivia Insight', a premium travel guide platform for Bolivia. You provide concise, insightful, and highly accurate travel advice about Bolivia. Keep your responses short (max 2-3 sentences) because you are inside a small chat bubble. Be conversational, slightly witty, and speak English but you can sprinkle a little Spanish (like 'Hola', 'Claro', 'Amigo'). If the user asks about something unrelated to travel in Bolivia, gently steer them back to Bolivia."
      });

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new InternalServerErrorException('Failed to communicate with AI model.');
    }
  }
}
