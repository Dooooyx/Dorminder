import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import DashboardIcon from '../assets/icons/ic_dashboard.png';
import NotificationIcon from '../assets/icons/ic_notification.png';
import RulesIcon from '../assets/icons/ic_rules.png';
import RequestIcon from '../assets/icons/ic_request.png';
import PaymentIcon from '../assets/icons/ic_payment.png';

const BotNav = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'news', label: 'News', icon: NotificationIcon },
    { id: 'rules', label: 'Rules', icon: RulesIcon },
    { id: 'request', label: 'Requests', icon: RequestIcon },
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
  tabItem: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 12,
    minHeight: 60
  },
  activeTab: { },
  tabIcon: { 
    width: 24, 
    height: 24, 
    marginBottom: 4, 
    tintColor: '#000000',
    alignSelf: 'center'
  },
  activeTabIcon: { tintColor: '#EE6C4D' },
  tabLabel: { fontSize: 12, color: '#000000', fontWeight: '500' },
  activeTabLabel: { color: '#EE6C4D', fontWeight: '600' },
});

export default BotNav;


