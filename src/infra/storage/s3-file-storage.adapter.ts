import { S3 } from 'aws-sdk';
import {
  FileStorage,
  UploadParameters,
  UploadResult,
} from '@client-service/data/protocols/storage';
import { CONFIG } from '@client-service/config';

export class S3FileStorageAdapter implements FileStorage {
  private s3Client: S3;

  constructor() {
    this.s3Client = new S3({
      region: CONFIG.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: CONFIG.AWS_ACCESS_KEY_ID!,
        secretAccessKey: CONFIG.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async upload(parameters: UploadParameters): Promise<UploadResult> {
    const { Key, Location } = await this.s3Client
      .upload({
        Bucket: CONFIG.AWS_S3_BUCKET!,
        Key: parameters.fileKey,
        Body: parameters.file,
        ContentType: parameters.mimeType,
      })
      .promise();

    return {
      key: Key,
      url: Location,
    };
  }
}
