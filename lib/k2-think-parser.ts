/**
 * Simple K2-Think response parser
 * Extracts <think> and <answer> sections from AI responses
 */

export interface K2ThinkResponse {
  think: string;
  thinking: string;
  answer: string;
  hasThinking: boolean;
}

export function hasK2ThinkTags(text: string): boolean {
  return text.includes('<think>') && text.includes('</think>');
}

export function parseK2ThinkResponse(text: string): K2ThinkResponse {
  const thinkMatch = text.match(/<think>([\s\S]*?)<\/think>/);
  const answerMatch = text.match(/<answer>([\s\S]*?)<\/answer>/);

  const thinkContent = thinkMatch ? thinkMatch[1].trim() : '';

  return {
    think: thinkContent,
    thinking: thinkContent,
    answer: answerMatch ? answerMatch[1].trim() : text,
    hasThinking: !!thinkContent,
  };
}
