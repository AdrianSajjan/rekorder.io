import { api } from '../libs/api-client';

export const ChatApiFactory = {
  Endpoint: 'http://localhost:8000',
  Keys: {
    Chat: (recording: string) => ['chat', recording],
  },
  Api: {
    Chat: async (prompt: string, session: string) => {
      const response = await api(ChatApiFactory.Endpoint + '/api/chat/stream', {
        method: 'POST',
        body: JSON.stringify({ prompt, session }),
      });

      if (!response.ok || !response.body) {
        const error = await response.json().catch(() => ({ message: 'Oops! Something went wrong.' }));
        throw error;
      }

      return response.body;
    },
  },
};
