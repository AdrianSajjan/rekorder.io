import Draggable from "react-draggable";

import { MoveDiagonal2Icon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";

import { CAMERA_DIMENTIONS, SAFE_AREA_PADDING } from "@screenify.io/recorder/constants/layout";
import { useWindowDimensions } from "@screenify.io/recorder/hooks/use-window-dimensions";
import { camera } from "@screenify.io/recorder/store/camera";

const CameraPreviewHOC = observer(() => {
  if (camera.device === "n/a" || !camera.enabled) {
    return null;
  } else {
    return <CameraPreview />;
  }
});

const CameraPreview = observer(() => {
  const video$ = useRef<HTMLVideoElement>(null);
  const canvas$ = useRef<HTMLCanvasElement>(null);
  const container$ = useRef<HTMLDivElement>(null!);

  const [cameraSize, setCameraSize] = useState(200);
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    if (!video$.current || !canvas$.current) return;
    camera.initializeElements(video$.current, canvas$.current).createStream();
  }, []);

  const defaultPosition = {
    x: SAFE_AREA_PADDING,
    y: SAFE_AREA_PADDING,
  };

  const bounds = {
    left: SAFE_AREA_PADDING,
    top: SAFE_AREA_PADDING,
    right: screenWidth - cameraSize - SAFE_AREA_PADDING,
    bottom: screenHeight - cameraSize - SAFE_AREA_PADDING,
  };

  const styles = {
    width: cameraSize,
    height: cameraSize,
  };

  return (
    <Draggable handle="#camera-handle" nodeRef={container$} defaultPosition={defaultPosition} bounds={bounds}>
      <div ref={container$} className="absolute group pointer-events-auto">
        <button
          onClick={() => camera.changeDevice("n/a")}
          className="absolute top-3.5 left-3.5 bg-blank hover:bg-secondary-black h-8 w-8 rounded-full grid place-items-center transition-opacity opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
        >
          <XIcon size={16} className="text-light" />
        </button>
        <div
          id="camera-handle"
          className="rounded-full overflow-hidden border-2 border-border shadow-shadow cursor-move animate-in zoom-in-75 fade-in-0"
          style={styles}
        >
          <canvas ref={canvas$} className="w-full h-full bg-blank rounded-full" />
          <video ref={video$} height={CAMERA_DIMENTIONS} width={CAMERA_DIMENTIONS} className="object-cover hidden" playsInline muted />
        </div>
        <button
          className="absolute bottom-3 right-3 bg-blank hover:bg-secondary-black h-8 w-8 rounded-full grid place-items-center transition-opacity opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
          onClick={() => setCameraSize(cameraSize === 200 ? 400 : 200)}
        >
          <MoveDiagonal2Icon size={16} className="text-light" />
        </button>
      </div>
    </Draggable>
  );
});

export { CameraPreviewHOC as CameraPreview };
