export type StoredImage = { key: string; url: string; contentType: string; size: number };

export interface ObjectStorageProvider {
  put(file: File, ownerId: string): Promise<StoredImage>;
  delete(key: string, ownerId: string): Promise<void>;
  signedUrl(key: string, ownerId: string): Promise<string>;
}

export interface BackgroundRemovalProvider {
  removeBackground(imageUrl: string): Promise<{ imageUrl: string }>;
}

export class PassthroughBackgroundRemovalProvider implements BackgroundRemovalProvider {
  async removeBackground(imageUrl: string) {
    return { imageUrl };
  }
}
