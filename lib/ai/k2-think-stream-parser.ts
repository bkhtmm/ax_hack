/**
 * K2-Think Stream Parser
 * Parses <think> and <answer> tags during streaming to hide thinking sections
 */

export function createK2ThinkStreamParser() {
  let buffer = '';
  let inThinkSection = false;
  let thinkContent = '';
  let answerContent = '';
  let thinkStartFound = false;
  let thinkEndFound = false;
  let answerStartFound = false;
  let answerEndFound = false;

  return new TransformStream<string, string>({
    transform(chunk: string, controller) {
      buffer += chunk;

      // Check if we have a complete think section
      if (!thinkStartFound && buffer.includes('<think>')) {
        thinkStartFound = true;
        inThinkSection = true;
        const thinkStartIndex = buffer.indexOf('<think>');
        // Output any content before <think> tag
        if (thinkStartIndex > 0) {
          controller.enqueue(buffer.substring(0, thinkStartIndex));
        }
        buffer = buffer.substring(thinkStartIndex + 7); // Remove '<think>'
      }

      // If we're in think section, accumulate but don't output
      if (inThinkSection) {
        const thinkEndIndex = buffer.indexOf('</think>');
        if (thinkEndIndex !== -1) {
          thinkContent += buffer.substring(0, thinkEndIndex);
          buffer = buffer.substring(thinkEndIndex + 8); // Remove '</think>'
          inThinkSection = false;
          thinkEndFound = true;
        } else {
          // Still accumulating think content
          thinkContent += buffer;
          buffer = '';
          return; // Don't output anything yet
        }
      }

      // Check for answer section
      if (thinkEndFound && !answerStartFound && buffer.includes('<answer>')) {
        answerStartFound = true;
        const answerStartIndex = buffer.indexOf('<answer>');
        buffer = buffer.substring(answerStartIndex + 8); // Remove '<answer>'
      }

      // Check for answer end
      if (answerStartFound && !answerEndFound && buffer.includes('</answer>')) {
        const answerEndIndex = buffer.indexOf('</answer>');
        answerContent += buffer.substring(0, answerEndIndex);
        buffer = buffer.substring(answerEndIndex + 9); // Remove '</answer>'
        answerEndFound = true;
      }

      // Output content based on current state
      if (answerStartFound && !answerEndFound) {
        // We're inside answer tags, output the content
        controller.enqueue(buffer);
        buffer = '';
      } else if (!thinkStartFound || (thinkEndFound && !answerStartFound)) {
        // Either no special tags found yet, or we're between think and answer
        // For K2-Think, we expect answer after think, so wait
        if (!thinkStartFound) {
          // No special formatting, output as is
          controller.enqueue(buffer);
          buffer = '';
        }
      } else if (answerEndFound) {
        // We've completed parsing, output any remaining content
        controller.enqueue(answerContent);
        answerContent = '';
        // Reset for potential next response
        if (buffer.length > 0) {
          controller.enqueue(buffer);
          buffer = '';
        }
      }
    },

    flush(controller) {
      // Output any remaining buffered content
      if (buffer.length > 0) {
        // If we have accumulated answer content, output it
        if (answerContent.length > 0) {
          controller.enqueue(answerContent);
        } else if (!inThinkSection) {
          // Only output buffer if we're not in the middle of a think section
          controller.enqueue(buffer);
        }
      }
    }
  });
}