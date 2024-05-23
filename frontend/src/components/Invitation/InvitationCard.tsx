import { InvitationCardProps } from '@/types';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const InvitationCard = ({ invitation, onAccept, onDecline }: InvitationCardProps) => {
  const [response, setResponse] = useState<"accept" | "decline" | "none">("none");

  const handleAccept = () => {
    setResponse('accept');
    onAccept(invitation.id);
  };

  const handleDecline = () => {
    setResponse('decline');
    onDecline(invitation.id);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        <Text style={{ fontWeight: 'bold' }}>{`${invitation.inviter.firstName}`}</Text>
        <Text> has invited you to join</Text>
        <Text style={{ fontWeight: 'bold' }}> {`${invitation.trip.name}`}</Text>
        <Text> trip</Text>
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleAccept}
          style={[styles.button, styles.acceptButton, response !== 'none' && styles.disabledButton]}
          disabled={response !== 'none' ? true : false}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDecline}
          style={[styles.button, styles.declineButton, response !== 'none' && styles.disabledButton]}
          disabled={response !== 'none' ? true : false}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginHorizontal: 5,
    borderBottomWidth: 4,
    borderBottomColor: '#ccc',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  text: {
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  declineButton: {
    backgroundColor: 'red',
  },
  disabledButton: {
    backgroundColor: 'lightgray'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});

export default InvitationCard;
``;
