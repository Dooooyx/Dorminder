import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const TenantRulesTest = () => {
  const testRules = [
    {
      id: '1',
      title: 'Test Rule 1',
      description: 'Test description',
      rules: ['Rule 1.1', 'Rule 1.2'],
      icon: 'checkmark'
    },
    {
      id: '2', 
      title: 'Test Rule 2',
      description: 'Test description 2',
      rules: ['Rule 2.1', 'Rule 2.2'],
      icon: 'moon'
    }
  ];

  const RuleSection = ({ rule }) => {
    if (!rule) {
      return null;
    }
    
    const ruleTitle = rule.title || 'Untitled Rule';
    const ruleDescription = rule.description || '';
    const ruleItems = rule.rules || [];
    
    return (
      <View style={styles.ruleSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>✓</Text>
          <Text style={styles.sectionTitle}>{ruleTitle}</Text>
        </View>
        {ruleDescription ? (
          <Text style={styles.sectionDescription}>{ruleDescription}</Text>
        ) : null}
        <View style={styles.rulesList}>
          {ruleItems.map((ruleItem, index) => {
            const ruleNumber = (index + 1) + '.';
            return (
              <View key={index} style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>{ruleNumber}</Text>
                <Text style={styles.ruleText}>{ruleItem || ''}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.mainTitle}>Test Rules</Text>
        {testRules.map((rule) => (
          <RuleSection key={rule.id} rule={rule} />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E53E3E',
    marginBottom: 20,
  },
  ruleSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E53E3E',
    flex: 1,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 12,
    marginLeft: 36,
  },
  rulesList: {
    paddingLeft: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  ruleNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
    minWidth: 20,
  },
  ruleText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
    flex: 1,
  },
});

export default TenantRulesTest;
