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
        <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
          <Image 
            source={require('../assets/icons/ic_notification.png')}
            style={styles.notificationIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        {/* TODO: Replace with user profile avatar icon PNG */}
        <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{userName?.charAt(0) || 'U'}</Text>
          </View>
        </TouchableOpacity>
        
        {/* TODO: Replace with hamburger menu icon PNG */}
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
        <Image 
            source={require('../assets/icons/ic_burgerNav.png')} // Replace with your actual path
            style={styles.menuIcon}
            resizeMode="contain"
          />
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
      padding: 4, 
      marginHorizontal: 2,
      width: 32,  // Reduced size for tighter spacing
      height: 32, // Reduced size for tighter spacing
      justifyContent: 'center',
      alignItems: 'center'
    },
    menuIcon: {
      width: 24,
      height: 24,
      tintColor: '#334155', // This will apply color to your PNG icon
    },
    notificationIcon: {
      width: 20,
      height: 20,
      tintColor: '#334155', // This will apply color to your PNG icon
    },
    icon: { 
      fontSize: 20, 
      color: '#334155',
      textAlign: 'center'
    },
    profileButton: { 
      padding: 2,
      width: 32,  // Reduced size to match iconButton
      height: 32, // Reduced size to match iconButton
      justifyContent: 'center',
      alignItems: 'center'
    },
    profileImage: {
      width: 24,
      height: 24,
      borderRadius: 12, // Updated to match the smaller size (24/2 = 12)
      backgroundColor: '#4A90E2',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileInitial: { color: '#fff', fontWeight: 'bold' },
  });
  

export default TopNav;


