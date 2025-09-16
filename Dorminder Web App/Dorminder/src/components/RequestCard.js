import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RequestCard = ({ request, onPress }) => {
  const getBorderColor = (priority, type) => {
    switch (priority) {
      case 'high':
        return '#E53E3E'; // Orange/Red
      case 'medium':
        return '#3182CE'; // Blue
      case 'low':
        return '#38B2AC'; // Light Blue/Teal
      default:
        return '#3182CE';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'room cleaning':
        return '#2C5282'; // Dark Blue
      case 'airconditioning cleaning':
        return '#E53E3E'; // Orange/Red
      case 'airconditioning maintenance':
        return '#38B2AC'; // Light Blue/Teal
      case 'door repair':
        return '#38B2AC'; // Light Blue/Teal
      default:
        return '#3182CE';
    }
  };

  const borderColor = getTypeColor(request.type);

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: borderColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Text style={styles.requestType}>{request.type}</Text>
        <Text style={styles.roomInfo}>
          ROOM # {request.roomNumber} - {request.date}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flex: 1,
  },
  requestType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 4,
  },
  roomInfo: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
});

export default RequestCard;
