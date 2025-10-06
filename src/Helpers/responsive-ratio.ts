// packages
import {Dimensions, PixelRatio, StatusBar} from "react-native";

// Retrieve initial screen's width
let screenWidth = Dimensions.get("window").width;

// Retrieve initial screen's height
let screenHeight = Dimensions.get("window").height;

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param  {string} widthPercent The percentage of screen's width that UI element should cover
 *                               along with the percentage symbol (%).
 * @return {number}              The calculated dp depending on current device's screen width.
 */
const wp = widthPercent => {
	// Parse string percentage input and convert it to number.
	const elemWidth =
		typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);

	// Use PixelRatio.roundToNearestPixel method in order to round the layout
	// size (dp) to the nearest one that correspons to an integer number of pixels.
	return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param  {string} heightPercent The percentage of screen's height that UI element should cover
 *                                along with the percentage symbol (%).
 * @return {number}               The calculated dp depending on current device's screen height.
 */
const hp = heightPercent => {
	// Parse string percentage input and convert it to number.
	const elemHeight =
		typeof heightPercent === "number"
			? heightPercent
			: parseFloat(heightPercent);

	// Use PixelRatio.roundToNearestPixel method in order to round the layout
	// size (dp) to the nearest one that correspons to an integer number of pixels.
	return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

/**
 * Event listener function that detects orientation change (every time it occurs) and triggers
 * screen rerendering. It does that, by changing the state of the screen where the function is
 * called. State changing occurs for a new state variable with the name 'orientation' that will
 * always hold the current value of the orientation after the 1st orientation change.
 * Invoke it inside the screen's constructor or in componentDidMount lifecycle method.
 * @param {object} that Screen's class component this variable. The function needs it to
 *                      invoke setState method and trigger screen rerender (this.setState()).
 */
const listenOrientationChange = that => {
	Dimensions.addEventListener("change", newDimensions => {
		// Retrieve and save new dimensions
		screenWidth = newDimensions.window.width;
		screenHeight = newDimensions.window.height;

		// Trigger screen's rerender with a state update of the orientation variable
		that.setState({
			orientation: screenWidth < screenHeight ? "portrait" : "landscape",
		});
	});
};

const standardLength = screenWidth > screenHeight ? screenWidth : screenHeight;
const offset =
	screenWidth > screenHeight
		? 0
		: Platform.OS === "ios"
		? 78
		: StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

const deviceHeight =
	Platform.OS === "android" ? standardLength - offset : standardLength;

export function RFPercentage(percent) {
	const heightPercent = (percent * deviceHeight) / 100;
	return Math.round(heightPercent);
}

// guideline height for standard 5" device screen is 680
export function RFValue(fontSize, standardScreenHeight = 680) {
	const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
	return Math.round(heightPercent);
}

// export var units = {
export const vw = screenWidth / 100;
export const vh = screenHeight / 100;
// };

// units.vmin = Math.min(units.vw, units.vh);
// units.vmax = Math.max(units.vw, units.vh);
const baseWidth = 380;
const baseHeight = 720;

const scaleWidth = screenWidth / baseWidth;
const scaleHeight = screenHeight / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);

const scaledSize = size => Math.ceil(size * scale);

export {wp, scaledSize, hp, listenOrientationChange};
