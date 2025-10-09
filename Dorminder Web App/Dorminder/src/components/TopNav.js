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
        <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
          <Image 
            source={require('../assets/icons/ic_notification.png')}
            style={styles.notificationIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        {/* Grouped Profile and Menu with oblong border */}
        <View style={styles.profileMenuGroup}>
          <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>{userName?.charAt(0) || 'U'}</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <Image 
              source={require('../assets/icons/ic_burgerNav.png')}
              style={styles.menuIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
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
    notificationButton: { 
      padding: 4, 
      marginHorizontal: 2,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      // No border radius for notification
    },
    profileMenuGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#D6DEE3',
      borderRadius: 25,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginLeft: 4,
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
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 4,
    },
    menuButton: { 
      padding: 2,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
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


