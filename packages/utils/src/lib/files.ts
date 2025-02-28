import { nanoid } from 'nanoid';
import type { User } from '@supabase/supabase-js';

export function createFileName(blob: Blob) {
  const name = nanoid();
  const extension = blob.type.split('/')[1];
  return name + '.' + extension;
}

export function createFilePath(user: User, blob: Blob) {
  const name = createFileName(blob);
  return user.id + '/' + name;
}

export function parseUploadedFilePath(path: string) {
  const [, ...file] = path.split('/');
  return file.join('/');
}
