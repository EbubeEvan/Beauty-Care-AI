import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

/**
 * Generate a concise, meaningful title for a chat conversation
 * using a lightweight LLM call. Falls back to keyword extraction.
 */
export async function generateChatTitle(
  userMessage: string,
  assistantMessage: string,
): Promise<string> {
  try {
    const prompt = userMessage
      ? `User: ${userMessage}\nAssistant: ${assistantMessage}`
      : `Assistant: ${assistantMessage}`;

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system:
        `Generate a concise, descriptive title (3-8 words, max 50 characters) for this chat conversation. ` +
        `Focus on the main topic or task. Use clear, active language. ` +
        `No quotes, no special formatting. Just the title text.`,
      prompt,
      temperature: 0.2,
    });

    let title = text.replace(/^["']|["']$/g, '').trim();
    if (title.length > 50) title = title.substring(0, 47) + '...';
    return title || 'New Chat';
  } catch (error) {
    console.error('Title generation failed, using fallback:', error);

    // Fallback: extract first few words from user message
    if (userMessage) {
      const words = userMessage.split(/\s+/).slice(0, 6).join(' ');
      return words.length > 50 ? words.substring(0, 47) + '...' : words || 'New Chat';
    }

    // Last resort fallback
    if (assistantMessage) {
      const words = assistantMessage.split(/\s+/).slice(0, 6).join(' ');
      return words.length > 50 ? words.substring(0, 47) + '...' : words || 'New Chat';
    }

    return 'New Chat';
  }
}
