import { View, Text } from 'react-native';
import React from 'react';

interface props {
  participants: string[]; // list of id of users
}

const ParticipantList = ({ participants }: props) => {
  return (
    <View>
      <Text>ParticipantList</Text>
    </View>
  );
};

export default ParticipantList;