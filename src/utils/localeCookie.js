const languageKey = 'roncoo-education-admin-languageKey'
import Cookies from 'js-cookie'

export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language) => Cookies.set(languageKey, language)
