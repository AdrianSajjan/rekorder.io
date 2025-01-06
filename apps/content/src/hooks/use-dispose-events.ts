import { useCallback } from 'react';

import { blur } from '../store/blur';
import { cursor } from '../store/cursor';
import { editor } from '../store/editor';
import { recorder } from '../store/recorder';
import { microphone } from '../store/microphone';

export function useDisposeEvents() {
  const handleDispose = useCallback(() => {
    blur.dispose();
    cursor.dispose();
    editor.dispose();
    recorder.dispose();
    microphone.dispose();
  }, []);

  return handleDispose;
}
