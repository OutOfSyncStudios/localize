// index.js
/* eslint no-unused-vars: "off" */

const __ = require('@mediaxpost/lodashext');

class Localize {
  constructor(dictionaries, defaultLang) {
    const defaults = {
      en: {
        __MissingDefaultLang: 'Selected default language is unavailable.'
      }
    };

    this.dictionaries = __.assign({}, defaults)
    if (dictionaries && typeof dictionaries === 'object') {
      __.assign(this.dictionaries, dictionaries);
    }

    defaultLang = this.sanitizeLanguageCode(defaultLang);
    this.setDefaultLanguage(defaultLang);
  }

  isLanguageAvailable(lang) {
    return this.dictionaries.hasOwnProperty(lang);
  }

  sanitizeLanguageCode(lang) {
    if (typeof lang === 'string') {
      return lang.substr(0, 2);
    }
    return 'en';
  }

  setDefaultLanguage(lang) {
    // Strip region from the langauge code
    lang = this.sanitizeLanguageCode(lang);
    if (this.isLanguageAvailable(lang)) {
      this.defaultLang = lang;
    } else {
      throw new Error(this.tr('__MissingDefaultLang'));
    }
  }

  listLanguages() {
    return Object.keys(this.dictionaries);
  }

  loadDictionary(lang, dictionary) {
    lang = this.sanitizeLanguageCode(lang);
    if (!this.dictionaries[lang]) {
      this.dictionaries[lang] = {};
    }
    __.assign(this.dictionaries[lang], dictionary);
  }

  tr(key, lang) {
    lang = this.sanitizeLanguageCode(lang);
    lang = lang || this.defaultLang;
    // If the language isn't availabe revert to the default language
    if (!this.isLanguageAvailable(lang)) {
      lang = this.defaultLang;
    }
    // Supports nested properties
    const val = __.get(this.dictionaries[lang], key);
    if (!val) {
      return '';
    }
    return val;
  }
}

module.exports = Localize;
