import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';

// Vertex AI instead of the public AI Studio endpoint: the generativelanguage
// API denies access to projects without an allow-listed billing setup, while
// Vertex serves the same Gemini models against the project's own credits.
// Auth comes from the Cloud Run service account, so no API key is needed.
const SYSTEM_INSTRUCTION =
  "You are Wara, a friendly and knowledgeable AI concierge for 'Bolivia Insight', a premium travel guide platform for Bolivia. You provide concise, insightful, and highly accurate travel advice about Bolivia. Keep your responses short (max 2-3 sentences) because you are inside a small chat bubble. Be conversational, slightly witty, and speak English but you can sprinkle a little Spanish (like 'Hola', 'Claro', 'Amigo'). If the user asks about something unrelated to travel in Bolivia, gently steer them back to Bolivia.";

@Injectable()
export class ChatService {
  private auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  private location = process.env.VERTEX_LOCATION || 'southamerica-east1';
  private model = process.env.VERTEX_MODEL || 'gemini-2.5-flash';

  async sendMessage(history: { role: string; parts: { text: string }[] }[], message: string) {
    try {
      const projectId = process.env.VERTEX_PROJECT_ID || (await this.auth.getProjectId());
      const client = await this.auth.getClient();

      const url =
        `https://${this.location}-aiplatform.googleapis.com/v1/projects/${projectId}` +
        `/locations/${this.location}/publishers/google/models/${this.model}:generateContent`;

      const contents = [...history, { role: 'user', parts: [{ text: message }] }];

      const res = await client.request({
        url,
        method: 'POST',
        data: {
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        },
      });

      const parts = (res.data as any)?.candidates?.[0]?.content?.parts ?? [];
      const text = parts.map((p: any) => p.text).filter(Boolean).join('').trim();

      return text || "I didn't quite catch that.";
    } catch (error) {
      console.error('Vertex AI Error:', error?.response?.data ?? error?.message ?? error);
      throw new InternalServerErrorException('Failed to communicate with AI model.');
    }
  }
}
