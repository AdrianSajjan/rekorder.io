import { Autocomplete } from './autocomplete';

export interface RuntimeMessage {
  type: RuntimeMessageEnum;
  payload: unknown;
}

export type RuntimeMessageEnum = Autocomplete<'recorder.capture.tab'>;
