/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {ThemeProvider} from '@shopify/restyle';

import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Route from './src/Navigation/Route';
import {persistor, store} from './src/Redux/Store';
import theme from './src/Theme';

interface AppProps {} // Define the empty interface

/**
 * The main component of the application.
 * It sets up the color scheme, background color, and renders the application UI.
 *
 * @param {AppProps} props - The properties passed to the component.
 * @returns {React.JSX.Element} The rendered application UI.
 */
function App({}: AppProps): React.JSX.Element {
  // Get the color scheme of the device
  const colorScheme = useColorScheme();
  // Set the background color based on the color scheme
  const backgroundColor =
    colorScheme === 'dark' ? Colors.darker : Colors.lighter;

  // Create a new instance of QueryClient for handling API requests
  const queryClient = new QueryClient();

  return (
    // The root view of the application
    <SafeAreaView style={{flex: 1, backgroundColor}}>
      {/* The status bar of the application */}
      <StatusBar
        // Set the style of the status bar based on the color scheme
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        // Set the background color of the status bar
        backgroundColor={backgroundColor}
      />

      {/* The theme provider for applying the theme to the application */}
      <ThemeProvider theme={theme}>
        {/* The provider for the Redux store */}
        <Provider store={store}>
          {/* The persistor for persisting the Redux store */}
          {/* <PersistGate loading={null} persistor={persistor}> */}
          {/* The provider for the QueryClient */}
          <QueryClientProvider client={queryClient}>
            {/* The main route of the application */}
            <Route />
          </QueryClientProvider>
          {/* </PersistGate> */}
        </Provider>
      </ThemeProvider>
    </SafeAreaView>
  );
}

export default App;
