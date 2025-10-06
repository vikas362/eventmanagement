import localization from './json';
import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings(localization) as object;

/**
 * Changes the language of the localization strings.
 *
 * @param {string} languageKey - The language key to set.
 * @return {void} This function does not return anything.
 */
export const changeLanguage = (languageKey: string): void => {
	strings.setLanguage(languageKey);
};
