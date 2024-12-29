import { Autocomplete } from './autocomplete';

export interface RuntimeMessage {
  type: RuntimeMessageEnum;
  payload: any;
}

export type RuntimeMessageEnum = Autocomplete<'capture.tab' | 'capture.tab.sucesss' | 'capture.tab.error'>;
