import React from 'react';
import { SplashScreen, Stack } from 'expo-router';
import store from '@/store/store';
import { Provider } from 'react-redux';

const RootNavigation = () => {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name='trips' options={{ title: 'Testing', headerShown: false }}
        />
      </Stack>
    </Provider>
  );
};

export default RootNavigation;