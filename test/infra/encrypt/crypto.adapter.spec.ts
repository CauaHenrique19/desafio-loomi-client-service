import { GenerateRandomCharactersParameters } from '@client-service/data/protocols/encrypt';
import { CryptoAdapter } from '@client-service/infra/encrypt';

describe('CryptoAdapter', () => {
  interface SutTypes {
    sut: CryptoAdapter;
  }

  const makeSut = (): SutTypes => {
    return {
      sut: new CryptoAdapter(),
    };
  };

  test('Should generate a string with the correct length', async () => {
    const { sut } = makeSut();

    const parameters: GenerateRandomCharactersParameters = { size: 10 };
    const randomString = await sut.generateRandomCharacters(parameters);

    expect(randomString).toBeTruthy();
    expect(randomString.length).toBe(10);
  });

  test('Should generate a hexadecimal string', async () => {
    const { sut } = makeSut();

    const parameters: GenerateRandomCharactersParameters = { size: 16 };
    const randomString = await sut.generateRandomCharacters(parameters);

    expect(randomString).toMatch(/^[0-9a-f]+$/);
    expect(randomString.length).toBe(16);
  });

  test('Should generate different strings on multiple calls', async () => {
    const { sut } = makeSut();

    const parameters: GenerateRandomCharactersParameters = { size: 8 };
    const str1 = await sut.generateRandomCharacters(parameters);
    const str2 = await sut.generateRandomCharacters(parameters);

    expect(str1).not.toBe(str2);
  });
});
