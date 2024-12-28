import { UserMediaDevice } from "@screenify.io/recorder/types/core";
import { useEffect, useState } from "react";

export function useFetchUserMicrophoneDevices() {
  const [microphones, setMicrophones] = useState<UserMediaDevice[]>([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then((devices) =>
        setMicrophones(
          devices.filter((device) => device.kind === "audioinput"),
        ),
      );
  }, []);

  return microphones;
}
