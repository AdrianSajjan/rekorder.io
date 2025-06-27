import { supabase } from '@rekorder.io/database';
import { queryOptions } from '@tanstack/react-query';
import { api } from '../libs/api-client';
import { z } from 'zod';

export const RecordingApiFactory = Object.freeze({
  Endpoint: 'http://localhost:8000',
  Keys: {
    FetchAll: () => ['recordings'],
    FetchOne: (id: string) => ['recordings', id],
  },
  Schemas: {
    Response: {
      ProcessRecording: z.object({
        documentation: z.string(),
      }),
    },
  },
  Apis: {
    FetchAll: async () => {
      const recording = await supabase.from('recordings').select('*').throwOnError();
      if (!recording.data) throw new Error('Failed to fetch recordings');
      return recording.data;
    },
    FetchOne: async (id: string) => {
      const recording = await supabase.from('recordings').select('*').eq('id', id).single().throwOnError();
      if (!recording.data) throw new Error('Recording not found');
      return recording.data;
    },
    UpdateRecording: async (id: string, updates: { document_markdown?: string }) => {
      const recording = await supabase.from('recordings').update(updates).eq('id', id).select().single().throwOnError();
      if (!recording.data) throw new Error('Failed to update recording');
      return recording.data;
    },
    ProcessRecording: async (url: string) => {
      const response = await api(RecordingApiFactory.Endpoint + '/api/recording/process', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Oops! Something went wrong.' }));
        throw error;
      }

      return response.json().then((data) => RecordingApiFactory.Schemas.Response.ProcessRecording.parse(data));
    },
  },
  Queries: {
    FetchAll: () => {
      return queryOptions({
        queryKey: RecordingApiFactory.Keys.FetchAll(),
        queryFn: () => RecordingApiFactory.Apis.FetchAll(),
      });
    },
    FetchOne: (id: string) => {
      return queryOptions({
        queryKey: RecordingApiFactory.Keys.FetchOne(id),
        queryFn: () => RecordingApiFactory.Apis.FetchOne(id),
      });
    },
  },
});
