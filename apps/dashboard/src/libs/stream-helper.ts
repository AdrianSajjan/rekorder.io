export function checkAgentStreamStatus(chunk: string) {
  return !['done', '[DONE]', 'chat_interaction_done'].some((status) => status.trim() === chunk.trim());
}
