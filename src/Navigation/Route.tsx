import {KeyboardAvoidingView, Platform} from 'react-native';
import React from 'react';
import Dashboard from './Dashboard';
import OnBoard from './OnBoard';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';

// type Props = {
// 	navigation: object;
// 	route: object;
// };

const Stack = createNativeStackNavigator();

const Route = () => {
	/**
	 * Render the navigation stack.
	 *
	 * @param {Props} props - The component props.
	 * @returns {React.ReactElement} The rendered navigation stack.
	 */
	const NavigationStack = (props: {
		/** The navigation object. */
		navigation: object;
		/** The route object. */
		route: object;
	}): React.ReactElement => {
		const {user} = useSelector(
			(state: {auth?: {user?: object}}) => state?.auth?.user,
		);

		let onboardCompleted = false;

		if (user) {
			onboardCompleted = true;
		}

		return (
			<>
				{onboardCompleted ? (
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : null}
						style={{flex: 1}}>
						<Dashboard {...props} />
					</KeyboardAvoidingView>
				) : (
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : null}
						style={{flex: 1}}>
						<OnBoard {...props} />
					</KeyboardAvoidingView>
				)}
			</>
		);
	};

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="NavigationStack">
				<Stack.Screen
					name="NavigationStack"
					component={NavigationStack}
					options={{headerShown: false}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Route;
