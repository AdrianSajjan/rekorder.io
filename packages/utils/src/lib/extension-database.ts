import Dexie, { Entity, EntityTable } from 'dexie';
import { OfflineDatabaseConfig } from '@rekorder.io/constants';

class ExtensionOfflineDatabase extends Dexie {
  blobs!: EntityTable<BlobStorage, 'id'>;

  constructor() {
    super(OfflineDatabaseConfig.ExtensionDatabaseName);
    this.version(OfflineDatabaseConfig.ExtensionDatabaseVersion).stores({ blobs: '++id, uuid, blob, duration, created_at' });
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
