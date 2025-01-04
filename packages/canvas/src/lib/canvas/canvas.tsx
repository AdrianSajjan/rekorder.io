import * as React from 'react';
import * as fabric from 'fabric';

import { isFunction } from 'lodash';
import { setupFabric } from '../utils/setup-fabric';

setupFabric();

interface FabricJSCanvasProps extends Omit<React.CanvasHTMLAttributes<HTMLCanvasElement>, 'onLoad'> {
  onLoad?: (canvas: fabric.Canvas) => void;
  options?: Partial<fabric.CanvasOptions>;
}

const FabricJSCanvas = React.forwardRef<fabric.Canvas, FabricJSCanvasProps>(({ onLoad, options, ...props }, ref) => {
  const canvas$ = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!canvas$.current) return;

    const canvas = new fabric.Canvas(canvas$.current, { ...options });

    if (ref) {
      if (isFunction(ref)) {
        ref(canvas);
      } else {
        ref.current = canvas;
      }
    }

    if (onLoad) {
      onLoad(canvas);
    }

    return () => {
      if (ref) {
        if (isFunction(ref)) {
          ref(null);
        } else {
          ref.current = null;
        }
      }
      canvas.dispose();
    };
  }, [onLoad, options, ref]);

  return <canvas ref={canvas$} {...props} />;
});

export { FabricJSCanvas };
