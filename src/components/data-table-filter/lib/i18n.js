import en from '../locales/en.json'

const translations = {
  en,
}

export function t(key, locale) {
  return translations[locale][key] ?? key
}
