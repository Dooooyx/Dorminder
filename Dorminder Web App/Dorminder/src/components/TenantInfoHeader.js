import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const TenantInfoHeader = ({ 
  roomNumber = "209", 
  contractDate = "Dec 2025", 
  showLogo = true,
  headerTitle = null,
  containerStyle = {},
  logoStyle = {},
  roomInfoStyle = {}
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header Bar - only render if headerTitle is provided */}
      {headerTitle && (
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
      )}
      
      {/* Logo Section */}
      {showLogo && (
        <View style={[styles.logoContainer, logoStyle]}>
          <Image 
            source={require('../assets/logo/logo_dorminder.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      )}
      
      {/* Room Info */}
      <Text style={[styles.roomInfo, roomInfoStyle]}>
        Room {roomNumber} | Contract until: {contractDate}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  headerBar: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 140,
    height: 45,
  },
  roomInfo: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default TenantInfoHeader;
