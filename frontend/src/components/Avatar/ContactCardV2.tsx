import { Status, User } from '@/types';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface ContactCardV2Props {
  user: User;
  addFriend: (id: string) => void;
  cancelFriendRequest: (id: string) => void;
}

const ContactCardV2 = ({ user, addFriend, cancelFriendRequest }: ContactCardV2Props) => {
  let content;
  if (user.friendStatus === "PENDING") {
    content =
      <TouchableOpacity
        onPressIn={() => cancelFriendRequest(user.id)}
        onPressOut={() => <Text>Cancelled</Text>}>
        <Text>
          Cancel Request
        </Text>
      </TouchableOpacity>;
  } else if (user.friendStatus === "ACCEPTED") {
    content = <Text>Friend</Text>;
  } else {
    content =
      <TouchableOpacity
        style={styles.deleteButton}
        onPressIn={() => addFriend(user.firebaseUserId)}
        onPressOut={() => <Text>Cancel request</Text>}>
        <Ionicons name="person-add" size={24} color="black" />
      </TouchableOpacity>;
  }

  const onPress = () => {
    router.push(`/userProfile/${user.id}`);
  };

  return (
    <TouchableOpacity style={styles.contactItem} onPress={onPress}>
      <Image source={{ uri: user.avatar?.url }} style={styles.profilePic} />
      <View style={{ flex: 1, justifyContent: 'center', gap: 5 }}>
        <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
        <Text style={styles.username}>{user.userName}</Text>
      </View>
      <View>
        {content}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  list: {
    marginTop: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    height: 70,
    marginHorizontal: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#000',
  }
});

export default ContactCardV2;
