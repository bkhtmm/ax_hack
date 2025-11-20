/**
 * Hook to parse K2-Think responses in real-time during streaming
 */

import { useMemo } from 'react';
import { parseK2ThinkResponse, hasK2ThinkTags } from '@/lib/k2-think-parser';

export function useK2ThinkParser(text: string | undefined) {
  return useMemo(() => {
    if (!text) {
      return {
        displayText: '',
        thinking: '',
        isK2Think: false,
      };
    }

    // Check if this is a K2-Think response
    if (hasK2ThinkTags(text)) {
      const parsed = parseK2ThinkResponse(text);
      return {
        displayText: parsed.answer,
        thinking: parsed.thinking,
        isK2Think: true,
      };
    }

    // Not a K2-Think response, return as-is
    return {
      displayText: text,
      thinking: '',
      isK2Think: false,
    };
  }, [text]);
}