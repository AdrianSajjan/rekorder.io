import { Autocomplete } from './autocomplete';

export interface RuntimeMessage<T = any> {
  type: RuntimeMessageEnum;
  payload: T;
}

export type RuntimeMessageEnum = Autocomplete<'capture.tab' | 'capture.tab.sucesss' | 'capture.tab.error' | 'open.permissions.settings'>;
