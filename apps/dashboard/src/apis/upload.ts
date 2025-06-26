import { z } from 'zod';
import { createFormData } from '../libs/form-helper';
import { api } from '../libs/api-client';

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
    UploadFile: async (file: File | Blob) => {
      const form = createFormData({ template_file: file }, {});

      const response = await api(UploadApiFactory.Endpoint, {
        method: 'POST',
        body: form,
        multipart: true,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Oops! Something went wrong.' }));
        throw error;
      }

      return response.json().then(UploadApiFactory.Schemas.Response.UploadFile.parse);
    },
  },
};
