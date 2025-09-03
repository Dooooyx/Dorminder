import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';

const TopNav = ({ userName, onNotificationPress, onProfilePress, onMenuPress }) => {
  return (
    <View style={styles.topNav}>
      <View style={styles.left}>
        <Image 
          source={require('../assets/logo/logo_dorminder.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.right}>
        {/* TODO: Replace with notification bell icon PNG */}
        <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>
        
        {/* TODO: Replace with user profile avatar icon PNG */}
        <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{userName?.charAt(0) || 'U'}</Text>
          </View>
        </TouchableOpacity>
        
        {/* TODO: Replace with hamburger menu icon PNG */}
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Text style={styles.icon}>☰</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    // Removed white background for transparent look
    
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
      },
    }),
  },
  left: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center' },
  logo: { 
    width: 120, 
    height: 40,
    marginLeft: 4
  },
  iconButton: { 
    padding: 8, 
    marginHorizontal: 6,
    width: 40,  // Equal size for all icons
    height: 40, // Equal size for all icons
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: { 
    fontSize: 20, 
    color: '#334155',
    textAlign: 'center'
  },
  profileButton: { 
    padding: 2,
    width: 40,  // Equal size for all icons
    height: 40, // Equal size for all icons
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: { color: '#fff', fontWeight: 'bold' },
});

export default TopNav;


