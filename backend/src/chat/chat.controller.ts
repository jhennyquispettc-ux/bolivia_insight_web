import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async handleChat(@Body() body: { messages: { from: string; text: string }[] }) {
    const messages = body.messages || [];
    
    if (messages.length === 0) {
      return { reply: "I didn't quite catch that." };
    }

    // The last message is the one the user just sent
    const lastMessage = messages[messages.length - 1];
    
    // Everything before the last message is history
    const history = messages.slice(0, -1).map(m => ({
      role: m.from === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    // Gemini requires the first message in history to be from the 'user'.
    if (history.length > 0 && history[0].role === 'model') {
      history.unshift({
        role: 'user',
        parts: [{ text: 'Hello!' }]
      });
    }

    const responseText = await this.chatService.sendMessage(history, lastMessage.text);
    return { reply: responseText };
  }
}
