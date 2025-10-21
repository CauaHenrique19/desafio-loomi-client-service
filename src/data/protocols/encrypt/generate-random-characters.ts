export interface GenerateRandomCharactersParameters {
  size: number;
}

export interface GenerateRandomCharacters {
  generateRandomCharacters(parameters: GenerateRandomCharactersParameters): Promise<string>;
}
