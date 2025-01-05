import * as fabric from 'fabric';

export interface ClassRegistryProps<T = fabric.FabricObject> {
  fromObject: (options: any) => Promise<T>;
}
