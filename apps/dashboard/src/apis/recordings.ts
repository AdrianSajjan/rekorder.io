import { supabase } from '@rekorder.io/database';
import { queryOptions } from '@tanstack/react-query';

export const RecordingApiFactory = Object.freeze({
  Keys: {
    FetchAll: () => ['recordings'],
    FetchOne: (id: string) => ['recordings', id],
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
