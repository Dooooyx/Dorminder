import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

const BotNav = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'rules', label: 'Rules', icon: '⚖️' },
    { id: 'request', label: 'Request', icon: '📝' },
    { id: 'payment', label: 'Payment', icon: '💳' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tabItem, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabPress(tab.id)}
        >
          <Text style={[styles.tabIcon, activeTab === tab.id && styles.activeTabIcon]}>
            {tab.icon}
          </Text>
          <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    ...Platform.select({ web: { position: 'sticky', bottom: 0 } }),
  },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  activeTab: { backgroundColor: 'rgba(74, 144, 226, 0.1)' },
  tabIcon: { fontSize: 20, marginBottom: 4, color: '#64748b' },
  activeTabIcon: { color: '#4A90E2' },
  tabLabel: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  activeTabLabel: { color: '#4A90E2', fontWeight: '600' },
});

export default BotNav;


