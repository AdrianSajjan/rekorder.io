interface WaitUnitWorkerEventOptions<P = any, E = any, SE = string, EE = string> {
  success: SE;
  error?: EE;
  onSuccess?: (payload: P) => void;
  onError?: (error: E) => void;
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function waitUnitWorkerEvent<P = any, E = any, SE = string, EE = string>(worker: Worker, { success, error, onSuccess, onError }: WaitUnitWorkerEventOptions<P, E, SE, EE>) {
  return new Promise<P>((resolve, reject) => {
    worker.addEventListener('message', function _(event) {
      if (event.data.type === success) {
        onSuccess?.(event.data.payload);
        worker.removeEventListener('message', _);
        resolve(event.data.payload);
      }
      if (event.data.type === error) {
        onError?.(event.data.payload);
        worker.removeEventListener('message', _);
        reject(event.data.payload);
      }
    });
  });
}
