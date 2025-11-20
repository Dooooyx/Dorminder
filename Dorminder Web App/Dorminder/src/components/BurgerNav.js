import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Pressable,
  Image,
  Platform,
} from 'react-native';

import { BlurView } from 'expo-blur';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = Math.round(SCREEN_WIDTH * 0.78);

const BurgerNav = ({
  visible,
  onClose,
  onViewRoomDetails,
  onContactInfo,
  onNotifications,
  onChangePassword,
  onLogout,
  userName = 'Chrystls Ambot',
  userAvatarUri,
}) => {
  // Allow both controlled (visible prop) and uncontrolled (internal) usage
  const [internalVisible, setInternalVisible] = useState(false);
  const isControlled = typeof visible === 'boolean';
  const isOpen = isControlled ? !!visible : internalVisible;

  const translateX = useRef(new Animated.Value(MENU_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const open = () => {
    if (!isControlled) setInternalVisible(true);
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: MENU_WIDTH,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!isControlled) setInternalVisible(false);
      onClose && onClose();
    });
  };

  useEffect(() => {
    if (isOpen) open();
    else if (isControlled) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleOverlayPress = () => close();

  const MenuItem = ({ label, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );

  if (!isOpen && !(!isControlled && internalVisible)) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Blur overlay */}
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity }]}
      >
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Press outside to close - only covers the overlay area */}
      <Pressable 
        style={StyleSheet.absoluteFill} 
        onPress={handleOverlayPress} 
      />

      {/* Slide-in menu panel */}
      <Animated.View
        style={[
          styles.panel,
          { transform: [{ translateX }] },
        ]}
        pointerEvents="box-none"
      >
        {/* Header with avatar + name and burger/close icon */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              {userAvatarUri ? (
                <Image source={{ uri: userAvatarUri }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
            </View>
            <View>
              <Text style={styles.profileName}>{userName.split(' ')[0]}</Text>
              <Text style={styles.profileSurname}>{userName.split(' ')[1] || ''}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={close} style={styles.burgerBtn} accessibilityRole="button" accessibilityLabel="Close menu">
            {/* Three horizontal lines */}
            <View style={styles.burgerLine} />
            <View style={styles.burgerLine} />
            <View style={styles.burgerLine} />
          </TouchableOpacity>
        </View>

        {/* Menu items */}
        <View style={styles.menuList}>
          <MenuItem label="Change Password" onPress={onChangePassword} />
          <MenuItem label="Log Out" onPress={onLogout} />
        </View>
      </Animated.View>
    </View>
  );
};

export default BurgerNav;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // Background removed since we're using BlurView
  },
  panel: {
    position: 'absolute',
    top: Platform.select({ ios: 50, android: 20, default: 20 }),
    right: 12,
    width: MENU_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { width: 42, height: 42, borderRadius: 21, overflow: 'hidden', backgroundColor: '#fde68a' },
  avatarImg: { width: '100%', height: '100%' },
  avatarPlaceholder: { flex: 1, backgroundColor: '#facc15' },
  profileName: { color: '#f97316', fontWeight: '800', fontSize: 16 },
  profileSurname: { color: '#f97316', fontWeight: '700', fontSize: 14, marginTop: -2 },
  burgerBtn: { width: 30, height: 24, justifyContent: 'space-between', alignItems: 'flex-end', paddingVertical: 2 },
  burgerLine: { width: 24, height: 2, backgroundColor: '#334155', borderRadius: 2 },
  menuList: { gap: 10, marginTop: 6 },
  menuItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  menuItemText: { color: '#374151', fontSize: 14, textAlign: 'center', fontWeight: '600' },
});
