import { Image } from 'react-native';
import React from 'react';

const SplashScreen = ({ width, height }) => {
  return (
    <Image
      source={{ uri: "https://i.pinimg.com/originals/a6/da/90/a6da90ae21d0e81fc323d5c4c9015298.gif" }}
      style={{ width: width, height: height, alignItems: 'center', justifyContent: 'center' }}
      resizeMode="contain"
    />
  );
};

export default SplashScreen;
