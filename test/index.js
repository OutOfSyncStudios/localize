const chai = require('chai');
const expect = chai.expect;

describe('localize', () => {
  const Localize = require('..');
  const local = new Localize({
    'ru': {
      __MissingDefaultLang: 'Выбранный язык по умолчанию недоступен'
    }
  });

  it('load', () => {
    const MyModule = require('..');
    const myClass = new MyModule();

    expect(myClass).to.be.instanceof(Localize);
  });

  it('tr[anslate]', () => {
    const tr = local.tr('__MissingDefaultLang');
    expect(tr).to.be.equal('Selected default language is unavailable.');
  });

  it('tr[anslate] (missing language)', () => {
    const tr = local.tr('__MissingDefaultLang', 'zh');
    expect(tr).to.be.equal('Selected default language is unavailable.');
  });

  it('tr[anslate] (missing key)', () => {
    const tr = local.tr('__MissingKey');
    expect(tr).to.be.equal('');
  });

  it('listLanguages', () => {
    const langs = local.listLanguages();
    expect(langs.length).to.be.equal(2);
    expect(langs[0]).to.be.equal('en');
    expect(langs[1]).to.be.equal('ru');
  });

  it('setDefaultLanguage (good)', () => {
    local.setDefaultLanguage('en');
    expect(local.defaultLang).to.be.equal('en');
  });

  it('setDefaultLanguage (bad)', () => {
    expect(() => { local.setDefaultLanguage('zh') }).to.throw('Selected default language is unavailable.');
  });

  it('isLanguageAvailable (good)', () => {
    const val = local.isLanguageAvailable('en');
    expect(val).to.be.equal(true);
  });

  it('isLanguageAvailable (bad)', () => {
    const val = local.isLanguageAvailable('zh');
    expect(val).to.be.equal(false);
  });

  it('sanitizeLanguageCode (good)', () => {
    const code = local.sanitizeLanguageCode('abcd');
    expect(code).to.be.equal('ab');
  });

  it('sanitizeLanguageCode (bad)', () => {
    const code = local.sanitizeLanguageCode(123);
    expect(code).to.be.equal('en');
  });

  it('loadDictionary (existing)', () => {
    local.loadDictionary('en', {
      'NewKey': 'Test',
      '__MissingDefaultLang': 'Lame'
    });
    let tr = local.tr('NewKey');
    expect(tr).to.be.equal('Test');
    tr = local.tr('__MissingDefaultLang');
    expect(tr).to.be.equal('Lame');
  });

  it('loadDictionary (new)', () => {
    local.loadDictionary('ja', {
      'NewKey': 'ありがと',
      '__MissingDefaultLang': '選択されたデフォルトの言語は利用できません'
    });
    let tr = local.tr('NewKey', 'ja');
    expect(tr).to.be.equal('ありがと');
    tr = local.tr('__MissingDefaultLang', 'ja');
    expect(tr).to.be.equal('選択されたデフォルトの言語は利用できません');
  });
});
