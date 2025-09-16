import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RequestTabBar = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'ongoing' && styles.activeTab
        ]}
        onPress={() => onTabPress('ongoing')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'ongoing' && styles.activeTabText
        ]}>
          Ongoing
        </Text>
        {activeTab === 'ongoing' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
      
      <View style={styles.separator} />
      
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'completed' && styles.activeTab
        ]}
        onPress={() => onTabPress('completed')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'completed' && styles.activeTabText
        ]}>
          Completed
        </Text>
        {activeTab === 'completed' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#293241',
    borderRadius: 12,
    marginVertical: 20,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeTab: {
  

  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  separator: {
    width: 2,
    backgroundColor: 'rgb(255, 255, 255)',
    marginVertical: 5,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -3,
    left: 30,
    right: 30,
    height: 3,
    backgroundColor: '#E0FBFC', // Teal/light blue underline
    borderRadius: 1.5,

  },
});

export default RequestTabBar;
