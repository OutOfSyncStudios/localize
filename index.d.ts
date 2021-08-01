declare module "@outofsync/localize";

type LocalizeDictionary = {
  [key: string]: string;
}

type LocalizeDictionaries = {
  [key: string]: LocalizeDictionary;
}

declare class Localize {
  constructor(dictionaries: LocalizeDictionaries, defaultLang: string);
  isLanguageAvailable(lang: string): boolean;
  sanitizeLanguageCode(lang: string): string;
  setDefaultLanguage(land: string): void;
  listLanguages(): string[];
  loadDictionary(lang: string, dictionary: LocalizeDictionary): void;
  tr(key: string, lang: string, ...params: any[]): string;
}

declare const obj: Localize;
export default obj;