-- Update all chats that have gemini-model to use chat-model instead
UPDATE "Chat" SET model = 'chat-model' WHERE model = 'gemini-model';

-- Show the result
SELECT id, model FROM "Chat" LIMIT 5;
