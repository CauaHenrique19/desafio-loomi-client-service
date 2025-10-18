import { CONFIG } from '@client-service/config';
import { UploadParameters } from '@client-service/data/protocols/storage';
import { S3FileStorageAdapter } from '@client-service/infra/storage';

const uploadMock = jest.fn();
const promiseMock = jest.fn();

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({
      upload: uploadMock.mockReturnValue({ promise: promiseMock }),
    })),
  };
});

describe('S3FileStorageAdapter', () => {
  interface SutTypes {
    sut: S3FileStorageAdapter;
  }

  const makeSut = (): SutTypes => {
    return {
      sut: new S3FileStorageAdapter(),
    };
  };

  const fakeParams: UploadParameters = {
    file: Buffer.from('file-content'),
    fileKey: 'user-1-image',
    mimeType: 'image/png',
  };

  beforeEach(() => {
    uploadMock.mockClear();
    promiseMock.mockClear();
  });

  test('Should call S3.upload with correct parameters', async () => {
    promiseMock.mockResolvedValueOnce({
      Key: fakeParams.fileKey,
      Location: 'https://bucket.s3.amazonaws.com/user-1-image',
    });

    const { sut } = makeSut();

    await sut.upload(fakeParams);

    expect(uploadMock).toHaveBeenCalledWith({
      Bucket: CONFIG.AWS_S3_BUCKET!,
      Key: fakeParams.fileKey,
      Body: fakeParams.file,
      ContentType: fakeParams.mimeType,
    });
  });

  test('Should return key and url on success', async () => {
    const expectedResult = {
      Key: fakeParams.fileKey,
      Location: 'https://bucket.s3.amazonaws.com/user-1-image',
    };

    promiseMock.mockResolvedValueOnce(expectedResult);

    const { sut } = makeSut();
    const result = await sut.upload(fakeParams);

    expect(result).toEqual({
      key: expectedResult.Key,
      url: expectedResult.Location,
    });
  });

  test('Should throw if S3.upload fails', async () => {
    promiseMock.mockRejectedValueOnce(new Error('S3 Error'));

    const { sut } = makeSut();

    await expect(sut.upload(fakeParams)).rejects.toThrow('S3 Error');
  });
});
