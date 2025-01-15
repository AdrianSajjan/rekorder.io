import Dexie, { Entity, EntityTable } from 'dexie';
import { DatabaseConfig } from '@rekorder.io/constants';

class ExtensionOfflineDatabase extends Dexie {
  blobs!: EntityTable<BlobStorage, 'id'>;

  constructor() {
    super(DatabaseConfig.ExtensionOfflineDatabaseName);
    this.version(DatabaseConfig.ExtensionOfflineDatabaseVersion).stores({
      blobs: '++id, uuid, original_blob, modified_blob, created_at, updated_at',
    });
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

  original_blob!: Blob;
  modified_blob!: Blob | null;

  created_at!: number;
  updated_at!: number | null;
}

export { ExtensionOfflineDatabase, BlobStorage };
