import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AvatarGroupProps } from '@/types';
import AvatarCard from './AvatarCard';

const AvatarGroup = ({ users, size }: AvatarGroupProps) => {
  const displayUsers = users.slice(0, 4); // Only take the first 5 users
  const additionalCount = users.length > 5 ? users.length - 5 : 0; // Calculate remaining users if more than 5

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}
    >
      {displayUsers.map((user, index) => (
        <View style={{
          marginRight: -12,
        }}>
          <AvatarCard
            user={user}
            key={index}
            size={size}
          />
        </View>
      ))}
      {additionalCount > 0 && (
        <View style={[styles.additionalAvatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        }]}>
          <Text style={styles.additionalText}>+{additionalCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  additionalAvatar: {
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -12,
  },
  additionalText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  }
});

export default AvatarGroup;