import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AnnouncementCard = ({
  dateText,
  statusLabel = 'Upcoming',
  title,
  subtitle,
  body,
  footer,
}) => {
  return (
    <View style={styles.card}>
      {/* Header with date and status badge */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{dateText}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      {/* Main content */}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {body && <Text style={styles.body}>{body}</Text>}
      {footer && <Text style={styles.footer}>{footer}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EA6A4B',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    color: '#FFE8E0',
    fontSize: 14,
  },
  statusBadge: {
    backgroundColor: '#5B6C94',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    color: '#FFE8E0',
    fontSize: 16,
    marginBottom: 12,
  },
  body: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    color: '#FFE8E0',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default AnnouncementCard;
