import Dexie, { Entity, EntityTable } from 'dexie';
import { DatabaseConfig } from '@rekorder.io/constants';

class ExtensionOfflineDatabase extends Dexie {
  blobs!: EntityTable<BlobStorage, 'id'>;

  constructor() {
    super(DatabaseConfig.ExtensionOfflineDatabaseName);
    this.version(DatabaseConfig.ExtensionOfflineDatabaseVersion).stores({ blobs: '++id, uuid, original, modified, duration, created_at' });
    this.blobs.mapToClass(BlobStorage);
  }

  static createInstance() {
    return new ExtensionOfflineDatabase();
  }
}

class BlobStorage extends Entity<ExtensionOfflineDatabase> {
  id!: number;
  uuid!: string;

  name!: string;
  duration!: number;

  original!: Blob;
  created_at!: number;

  modified!: Blob | null;
  updated_at!: number | null;
}

export { ExtensionOfflineDatabase, BlobStorage };
