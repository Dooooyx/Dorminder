import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const InfoCard = ({
  title,
  leftColumn,
  rightColumn,
  ctaText,
  onCtaPress,
}) => {
  // Expect one item per column for this card. We'll stack them vertically.
  const topItem = leftColumn?.[0];
  const bottomItem = rightColumn?.[0];

  return (
    <View style={styles.card}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}

      {/* Top section: Current Balance */}
      {topItem && (
        <View style={styles.section}>
          <Text style={styles.itemLabel}>{topItem.label}</Text>
          {topItem.date ? <Text style={styles.itemDate}>{topItem.date}</Text> : null}
          <Text style={styles.itemValue}>{topItem.value}</Text>
        </View>
      )}

      {/* Bottom section: Last Payment */}
      {bottomItem && (
        <View style={[styles.section, styles.sectionSpacing]}>
          <Text style={styles.itemLabel}>{bottomItem.label}</Text>
          {bottomItem.date ? <Text style={styles.itemDate}>{bottomItem.date}</Text> : null}
          <Text style={styles.itemValue}>{bottomItem.value}</Text>
        </View>
      )}

      {/* CTA bottom-right */}
      {ctaText && (
        <TouchableOpacity style={styles.ctaButton} onPress={onCtaPress}>
          <Text style={styles.ctaText}>{ctaText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2E5984',
    borderRadius: 20,
    padding: 16, // compact
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  section: {
    alignItems: 'flex-start',
  },
  sectionSpacing: {
    marginTop: 8,
  },
  itemLabel: {
    color: '#E2ECF6',
    fontSize: 14, // smaller subtitle
  },
  itemDate: {
    color: '#D1E3F8',
    fontSize: 12, // muted small
    marginTop: 2,
  },
  itemValue: {
    color: '#fff',
    fontSize: 22, // larger amount
    fontWeight: '800',
    marginTop: 4,
  },
  ctaButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#CDEAE3',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 10,
  },
  ctaText: {
    color: '#2f4f4f',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default InfoCard;
