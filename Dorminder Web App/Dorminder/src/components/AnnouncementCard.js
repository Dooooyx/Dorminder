import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AnnouncementCard = ({
  dateText,
  statusLabel = 'Upcoming',
  title,
  subtitle,
  body,
  footer,
  statusColor = '#475E82', // blue for upcoming, orange for active
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Left colored accent */}
      <View style={[styles.accent, { backgroundColor: statusLabel === 'Active' ? '#EA6A4B' : statusColor }]} />
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.dateText}>{dateText}</Text>
          <View style={[styles.badge, { backgroundColor: statusLabel === 'Active' ? '#F08A67' : '#475E82' }]}>
            <Text style={styles.badgeText}>{statusLabel}</Text>
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {body ? <Text style={styles.body}>{body}</Text> : null}
        {footer ? <Text style={styles.footer}>{footer}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  accent: {
    width: 36,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EBEEF3',
    padding: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: { color: '#6b7280', fontSize: 12 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 4 },
  subtitle: { color: '#6b7280', fontSize: 12, marginBottom: 8 },
  body: { color: '#1f2937', fontSize: 14, lineHeight: 20, marginBottom: 12 },
  footer: { color: '#6b7280', fontSize: 12 },
});

export default AnnouncementCard;
