import Snackbar from 'react-native-snackbar';
import {palette} from '../Theme';

export const validphone = phone => {
	return phone?.startsWith('0') ? phone : '0' + phone;
};

/**
 * Displays an error snackbar with the given message.
 *
 * @param {string|string[]} message - The message to be displayed. Can be a single string or an array of strings.
 * @param {boolean} [durationLong=false] - Whether the snackbar should be displayed for a long duration. Default is false.
 */
export const displayErrorToast = (message, durationLong = false) => {
	// Extract the first element of the message array, or use the message as is if it's not an array
	const text = Array.isArray(message) ? message[0] : message;

	// Determine the duration of the snackbar based on the durationLong parameter
	const duration = durationLong ? Snackbar.LENGTH_LONG : Snackbar.LENGTH_SHORT;

	// Display the snackbar with the specified properties
	Snackbar.show({
		text, // The message to be displayed
		duration, // The duration of the snackbar
		backgroundColor: 'red', // The background color of the snackbar
		textColor: palette.white, // The text color of the snackbar
	});
};

/**
 * Displays a success snackbar with the given message and background color.
 *
 * @param {string|string[]} message - The message to be displayed. Can be a single string or an array of strings.
 * @param {string} [bg='#4BB543'] - The background color of the snackbar. Default is '#4BB543' (green).
 */
export const displaySuccessToast = (message, bg = '#4BB543') => {
	// Extract the first element of the message array, or use the message as is if it's not an array
	const text = Array.isArray(message) ? message[0] : message;

	// Display the snackbar with the given parameters
	Snackbar.show({
		text, // The text to be displayed
		duration: Snackbar.LENGTH_SHORT, // The duration of the snackbar
		backgroundColor: bg, // The background color of the snackbar
		textColor: palette.white, // The color of the text in the snackbar
	});
};
