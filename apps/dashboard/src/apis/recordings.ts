import { supabase } from '@rekorder.io/database';
import { queryOptions } from '@tanstack/react-query';

export const RecordingApiFactory = Object.freeze({
  Keys: {
    FetchAll: () => ['recordings'],
  },
  Apis: {
    FetchAll: async () => {
      const recording = await supabase.from('recordings').select('*').throwOnError();
      return recording.data || [];
    },
  },
  Queries: {
    FetchAll: () => {
      return queryOptions({
        queryKey: RecordingApiFactory.Keys.FetchAll(),
        queryFn: () => RecordingApiFactory.Apis.FetchAll(),
      });
    },
  },
});
