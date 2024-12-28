import { UserMediaDevice } from "@screenify.io/recorder/types/core";
import { useEffect, useState } from "react";

export function useFetchUserCameraDevices() {
  const [cameras, setCameras] = useState<UserMediaDevice[]>([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then((devices) =>
        setCameras(devices.filter((device) => device.kind === "videoinput")),
      );
  }, []);

  return cameras;
}
