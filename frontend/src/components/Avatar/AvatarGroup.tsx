import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AvatarGroupProps } from '@/types';
import AvatarCard from './AvatarCard';

const AvatarGroup = ({ users, size }: AvatarGroupProps) => {
  const displayUsers = users?.slice(0, 4); // Only take the first 5 users
  const additionalCount = users?.length > 5 ? users?.length - 5 : 0; // Calculate remaining users if more than 5

  console.log("displayUsers", displayUsers);
  return (
    <View
      style={{
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {displayUsers?.map((user, index) => (
        <View key={user?.invitee?.id} style={{ marginLeft: index === 0 ? 0 : -(50 / 4) }}>
          <AvatarCard user={user?.invitee} size={size} />
        </View>
      ))}
      {additionalCount > 0 && (
        <View style={[styles.additionalAvatar,
        {
          width: size,
          height: size,
          borderRadius: 9999,
          marginLeft: -(50 / 4),
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
  },
  additionalText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  }
});

export default AvatarGroup;
