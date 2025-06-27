import { supabase } from '@rekorder.io/database';
import { createFilePath } from '@rekorder.io/utils';
import { User } from '@supabase/supabase-js';
import { z } from 'zod';

export const UploadApiFactory = {
  Endpoint: 'https://qa.zocket.com/engine/ads/api/v1/upload_template_S3',
  Schemas: {
    Response: {
      UploadFile: z.object({
        url: z.string(),
      }),
    },
  },
  Apis: {
    UploadFile: async (user: User, file: File | Blob) => {
      const result = await supabase.storage.from('frames').upload(createFilePath(user, file), file);
      if (result.error) throw result.error;
      return result.data;
    },
  },
};
