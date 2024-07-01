import { View, } from 'react-native';
import React from 'react';
import UserAvatar from 'react-native-user-avatar';
import { AvatarCardProps } from '@/types';

const AvatarCard = ({ user, size = 50 }: AvatarCardProps) => {
  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: size / 2,
      }}
    >
      {
        user?.avatar?.url !== null ?
          <UserAvatar
            size={size}
            src={user?.avatar?.url}
          />
          :
          <UserAvatar
            size={size}
            name={user?.firstName + user?.lastName}
          />
      }
    </View>
  );
};

export default AvatarCard;
