import Dexie, { Entity, EntityTable } from 'dexie';
import { DatabaseConfig } from '@rekorder.io/constants';

class ExtensionOfflineDatabase extends Dexie {
  blobs!: EntityTable<BlobStorage, 'id'>;

  constructor() {
    super(DatabaseConfig.ExtensionOfflineDatabaseName);
    this.version(DatabaseConfig.ExtensionOfflineDatabaseVersion).stores({
      blobs: '++id, uuid, original_mp4, modified_mp4, original_webm, modified_webm, created_at, updated_at',
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
  created_at!: number;
  updated_at!: number | null;

  original_mp4!: Blob;
  modified_mp4!: Blob | null;
  original_webm!: Blob;
  modified_webm!: Blob | null;
}

export { ExtensionOfflineDatabase, BlobStorage };
