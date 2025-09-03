import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const InfoCard = ({
  title,
  leftColumn,
  rightColumn,
  ctaText,
  onCtaPress,
}) => {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      
      <View style={styles.cardContent}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          {leftColumn.map((item, index) => (
            <View key={index} style={styles.columnItem}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              {item.date && <Text style={styles.itemDate}>{item.date}</Text>}
              <Text style={styles.itemValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {rightColumn.map((item, index) => (
            <View key={index} style={styles.columnItem}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              {item.date && <Text style={styles.itemDate}>{item.date}</Text>}
              <Text style={styles.itemValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Button positioned at the bottom right */}
      {ctaText && (
        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.ctaButton} onPress={onCtaPress}>
            <Text style={styles.ctaText}>{ctaText}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2E5984',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16, // Add space for the CTA button
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  columnItem: {
    marginBottom: 16,
  },
  itemLabel: {
    color: '#D1E3F8',
    fontSize: 14,
    marginBottom: 4,
  },
  itemDate: {
    color: '#D1E3F8',
    fontSize: 12,
    marginBottom: 8,
  },
  itemValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  ctaContainer: {
    alignItems: 'flex-end', // Align button to the right
  },
  ctaButton: {
    backgroundColor: '#CDEAE3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaText: {
    color: '#2f4f4f',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default InfoCard;
