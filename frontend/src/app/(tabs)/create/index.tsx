
import React from 'react';
import { Redirect } from 'expo-router';

const index = () => {
  return (
    <Redirect href="/trips/create" />
  );
};

export default index;
