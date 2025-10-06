import React from 'react';
import {Box, Text} from '../../../Theme';
import Button from '../../../ReusableComponant/Button';
import {useDispatch} from 'react-redux';
// import {AuthConstants} from '../../../Redux';

import {displaySuccessToast} from '../../../Helpers/Utils';
import {strings} from '../../../Localization/Localization';
import {AuthConstants} from '../../../Redux';

type Props = {
  navigation: object;
  route: object;
};

const Login = () => {
  const dispatch = useDispatch();

  /**
   * Function to handle the login process.
   * It dispatches an action to store the user information in the Redux store.
   * It then displays a success toast message indicating the user is logged in.
   *
   * @return {void} This function does not return anything.
   */
  const login = (): void => {
    // User object with name property
    const user: {name: string} = {name: 'Trendwellness'};

    // Dispatch an action to store the user information in the Redux store
    dispatch<ReturnType<typeof AuthConstants.userInfoReceived>>({
      type: AuthConstants.USER_INFO_RECEIVED, // Action type for user info received
      user, // User object
    });

    // Display a success toast message
    displaySuccessToast('you are logged in');
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      {/* <Text variant="Black20Regular">Login</Text> */}
      <Button label={strings?.login} onPress={login} color="white" />
    </Box>
  );
};

export default Login;
