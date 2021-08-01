// index.js
/* eslint no-unused-vars: "off" */

const __ = {
  defaultsDeep: require('lodash.defaultsdeep'),
  forEach: require('lodash.foreach'),
  get: require('lodash.get'),
  merge: require('lodash.merge'),
};

class Localize {
  constructor(dictionaries, defaultLang) {
    const defaults = { en: { __MissingDefaultLang: 'Selected default language is unavailable.' } };

    if (typeof dictionaries !== 'object') {
      dictionaries = {};
    }
    this.dictionaries = __.defaultsDeep(dictionaries, defaults);

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
    this.dictionaries[lang] = __.merge(this.dictionaries[lang], dictionary);
  }

  tr(key, lang, ...params) {
    lang = this.sanitizeLanguageCode(lang);
    lang = lang || this.defaultLang;
    // If the language isn't availabe revert to the default language
    if (!this.isLanguageAvailable(lang)) {
      lang = this.defaultLang;
    }
    // Supports nested properties
    let retVal = __.get(this.dictionaries[lang], key);
    if (!retVal) {
      return null;
    }

    // Replace '$1', '$2', ... in translated text with passed parameters
    if (typeof retVal === 'string') {
      __.forEach(params, (val, idx) => {
        retVal = retVal.replace(`$${idx + 1}`, val);
      });
    }

    return retVal;
  }
}

module.exports = Localize;
