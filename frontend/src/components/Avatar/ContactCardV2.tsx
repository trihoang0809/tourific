import { Status, User } from '@/types';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ContactCardV2Props {
  user: User;
  addFriend: (id: string) => void;
  friendStatus: Status;
}

const ContactCardV2 = ({ user, addFriend, friendStatus }: ContactCardV2Props) => {
  let text = null;
  if (friendStatus === Status.PENDING) {
    text = 'Pending';
  } else if (friendStatus === 'ACCEPTED') {
    text = 'Friend';
  } else {
    text = null;
  }
  return (
    <TouchableOpacity style={styles.contactItem}>
      <Image source={{ uri: user.avatar?.url }} style={styles.profilePic} />
      <View style={{ flex: 1, justifyContent: 'center', gap: 5 }}>
        <Text style={styles.name}>{user.firstName}</Text>
        <Text style={styles.username}>{user.userName}</Text>
      </View>
      {
        text != null ?
          <Text>{text}</Text>
          :
          <TouchableOpacity style={styles.deleteButton} onPressIn={addFriend(user.id)}>
            <Ionicons name="person-add" size={24} color="black" />
          </TouchableOpacity>
      }
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
