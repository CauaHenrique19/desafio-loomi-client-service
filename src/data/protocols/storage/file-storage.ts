export interface UploadParameters {
  fileKey: string;
  file: Buffer;
  mimeType: string;
}

export interface UploadResult {
  key: string;
  url: string;
}

export interface FileStorage {
  upload(parameters: UploadParameters): Promise<UploadResult>;
}
