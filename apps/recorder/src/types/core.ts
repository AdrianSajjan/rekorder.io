export type UserMediaDevice = Pick<MediaDeviceInfo, "deviceId" | "label" | "kind">;

export type Autocomplete<T> = T | (string & {});
