export async function extractVideoFileThumbnail(video: File | Blob, timestamp?: number, crossOrigin?: string) {
  return new Promise<Blob>((resolve, reject) => {
    const url = URL.createObjectURL(video);
    const element = document.createElement('video');

    element.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;

      canvas.width = element.videoWidth;
      canvas.height = element.videoHeight;
      context.drawImage(element, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(blob);
          } else {
            reject('Failed to extract thumbnail');
          }
        },
        'image/png',
        1
      );
    });

    element.addEventListener('loadedmetadata', () => {
      element.currentTime = timestamp ?? element.duration / 2;
    });

    element.addEventListener('error', () => {
      reject('Failed to initialize video element');
      URL.revokeObjectURL(url);
    });

    element.crossOrigin = crossOrigin ?? 'anonymous';
    element.src = url;
  });
}
