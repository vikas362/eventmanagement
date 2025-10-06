import React from 'react';
import SpinnerButton from 'react-native-spinner-button';
import {StyleSheet, Platform} from 'react-native';

import {memo} from 'react';
import {palette, size, Text} from '../../Theme';

/**
 * Button component.
 *
 * @param {Object} props - The props object.
 * @param {string} props.label - The label to display on the button.
 * @param {boolean} props.loading - Whether the button is in a loading state.
 * @param {StyleProp<ViewStyle>} [props.buttonStyle] - The style of the button.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {string} [props.color] - The color of the text on the button.
 * @param {StyleProp<ViewStyle>} [props.disabledStyle] - The style of the button when it is disabled.
 * @param {Function} [props.buttondata] - The data to display on the button.
 * @param {string} [props.buttonColor] - The color of the button.
 * @param {string} [props.borderColor] - The color of the border of the button.
 * @param {Object} props.variant - The style variant of the Text component.
 * @returns {ReactElement} The Button component.
 */
const Button = ({
	label,
	loading,
	buttonStyle,
	disabled,
	color,
	disabledStyle,
	buttondata,
	buttonColor,
	borderColor,
	variant,
	...props
}: {
	label: string;
	loading: boolean;
	buttonStyle?: StyleProp<ViewStyle>;
	disabled?: boolean;
	color?: string;
	disabledStyle?: StyleProp<ViewStyle>;
	buttondata?: () => ReactNode;
	buttonColor?: string;
	borderColor?: string;
	variant?: Object;
	[key: string]: any;
}): ReactElement => {
	return (
		<SpinnerButton
			spinnerColor={'white'}
			disableStyle={{
				backgroundColor: '#cccccc',
				borderWidth: 0,
				borderRadius: disabledStyle ? 10 : 0,
			}}
			buttonStyle={[
				buttonStyle ? buttonStyle : styles.button,
				{
					shadowColor: borderColor
						? borderColor
						: disabled
						? '#cccccc'
						: palette.primary,
					shadowOffset: {
						width: 0,
						height: 0,
					},
					shadowOpacity: 0.18,
					shadowRadius: 1.0,
					elevation: 0,
					backgroundColor: buttonColor ? buttonColor : palette.primary,
					borderWidth: 1,
					borderColor: borderColor ? borderColor : palette.primary,
				},
			]}
			spinnerType="MaterialIndicator"
			isLoading={loading}
			{...props}
			indicatorCount={1}>
			{buttondata ? (
				buttondata()
			) : (
				<Text variant={variant ? variant : 'defaults'} color={color}>
					{label}
				</Text>
			)}
		</SpinnerButton>
	);
};

export default memo(Button);

export const styles = StyleSheet.create({
	button: {
		width: size?.width,
		height: Platform?.OS == 'web' ? 60 : 52,
		marginHorizontal: 20,
		borderRadius: 30,

		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
});
