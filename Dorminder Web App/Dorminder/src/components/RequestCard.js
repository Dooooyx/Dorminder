import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const RequestCard = ({ request, onPress, expanded = false }) => {
  const getBorderColor = (category, status) => {
    const cat = (category || '').toString().toLowerCase();
    if (cat === 'report') return '#EE6C4D'; // orange for reports
    if (status === 'completed') return '#2F855A'; // green
    return '#3182CE'; // blue for requests/default
  };

  const createdAt = request.createdAt?.toDate ? request.createdAt.toDate() : (request.createdAt?.seconds ? new Date(request.createdAt.seconds * 1000) : null);
  const dateStr = createdAt
    ? `${createdAt.toLocaleDateString()}  |  ${createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : (request.date || '');

  const title = request.title || request.type || 'Request';
  const roomInfo = request.roomNumber ? `ROOM # ${request.roomNumber}` : (request.tenantName ? request.tenantName : '');
  const borderColor = getBorderColor(request.category, request.status);

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: borderColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Text style={styles.requestType}>{title}</Text>
        <Text style={styles.roomInfo}>
          {roomInfo}{roomInfo ? ' - ' : ''}{dateStr}
        </Text>
      </View>
      {expanded && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailsLeft}>
            {!!request.description && (
              <Text style={styles.detailsText}>{request.description}</Text>
            )}
          </View>
          {!!request.imageUrl && (
            <Image source={{ uri: request.imageUrl }} style={styles.detailsImage} resizeMode="cover" />
          )}
        </View>
      )}
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
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#E2E8F0',
  },
  detailsLeft: {
    flex: 1,
    paddingRight: 12,
  },
  detailsText: {
    fontSize: 16,
    color: '#1A202C',
    lineHeight: 24,
    textDecorationLine: 'none',
  },
  detailsImage: {
    width: 120,
    height: 100,
    borderRadius: 6,
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
