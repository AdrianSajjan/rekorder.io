import Dexie, { Entity, EntityTable } from 'dexie';
import { DatabaseConfig } from '@rekorder.io/constants';

class ExtensionOfflineDatabase extends Dexie {
  blobs!: EntityTable<BlobStorage, 'id'>;

  constructor() {
    super(DatabaseConfig.ExtensionOfflineDatabaseName);
    this.version(DatabaseConfig.ExtensionOfflineDatabaseVersion).stores({ blobs: '++id, uuid, blob, duration, created_at' });
    this.blobs.mapToClass(BlobStorage);
  }

  static createInstance() {
    return new ExtensionOfflineDatabase();
  }
}

class BlobStorage extends Entity<ExtensionOfflineDatabase> {
  id!: number;
  uuid!: string;
  blob!: Blob;
  duration!: number;
  created_at!: number;
}

export { ExtensionOfflineDatabase, BlobStorage };
