import { solotravel } from '@/constants/images';
import React from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';

const NoFriendDisplay = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Friends</Text>
      </View>
      <Image
        source={{ uri: solotravel }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.mainText}>Looks like you have no friends!</Text>
      <Text style={styles.subText}>Invite your friends to join the team!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Give permission to access your contacts to invite your friends</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.inviteButton}>
        {/* another user story implement later */}
        <Text style={styles.inviteButtonText}>Invite friends</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300, // Adjust based on your image aspect ratio
  },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#e6e6e6',
    padding: 15,
    borderRadius: 20,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
  },
  inviteButton: {
    backgroundColor: '#00f',
    padding: 15,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  inviteButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  }
});

export default NoFriendDisplay;