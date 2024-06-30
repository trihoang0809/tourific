import { ContactCardProps } from '@/types';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';

const ContactCard = ({ user, isChecked, setChecked, status }: ContactCardProps) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.innerContainer}>
        <Image
          source={{
            uri: "https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg"
          }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.username}>{user.userName}</Text>
        </View>
      </View>
      {
        status === 'PENDING' ?
          <Text>Pending</Text>
          :
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={(newValue) => setChecked(newValue, user.id)}
            color={isChecked ? '#4630EB' : undefined}
          />
      }
    </View >
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  textContainer: {
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  name: {
    fontSize: 16
  },
  username: {
    fontSize: 13
  },
  checkbox: {
    marginRight: 30
  }
});

export default ContactCard;
