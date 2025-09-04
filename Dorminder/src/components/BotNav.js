import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import DashboardIcon from '../assets/icons/ic_dashboard.png';
import RulesIcon from '../assets/icons/ic_rules.png';
import RequestIcon from '../assets/icons/ic_request.png';
import PaymentIcon from '../assets/icons/ic_payment.png';

const BotNav = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'rules', label: 'Rules', icon: RulesIcon },
    { id: 'request', label: 'Request', icon: RequestIcon },
    { id: 'payment', label: 'Payment', icon: PaymentIcon },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tabItem, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabPress(tab.id)}
        >
          <Image
            source={tab.icon}
            style={[styles.tabIcon, activeTab === tab.id && styles.activeTabIcon]}
            resizeMode="contain"
          />
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
  activeTab: { backgroundColor: 'rgba(74, 144, 226, 0.08)' },
  tabIcon: { width: 22, height: 22, marginBottom: 4, tintColor: '#64748b' },
  activeTabIcon: { tintColor: '#4A90E2' },
  tabLabel: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  activeTabLabel: { color: '#4A90E2', fontWeight: '600' },
});

export default BotNav;


