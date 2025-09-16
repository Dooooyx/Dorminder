import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import TopNav from '../components/TopNav';
import BotNav from '../components/BotNav';
import InfoCard from '../components/InfoCard';
import AnnouncementCard from '../components/AnnouncementCard';
import BurgerNav from '../components/BurgerNav';
import TenantInfoHeader from '../components/TenantInfoHeader';

const TenantDashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isBurgerNavVisible, setIsBurgerNavVisible] = React.useState(false);
  const userName = 'Chrystls';

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'rules') {
      navigation.navigate('TenantRules');
    } else if (tabId === 'request') {
      navigation.navigate('TenantRequests');
    }
    // For other tabs, show placeholder content within this screen
    // In the future, these can be separate screens
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
    // Add your notification logic here
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
    // Add your profile logic here
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
    setIsBurgerNavVisible(true);
  };

  const handleViewMore = () => {
    console.log('View More pressed');
    // Add your view more logic here
  };

  // BurgerNav handlers
  const handleCloseBurgerNav = () => {
    setIsBurgerNavVisible(false);
  };

  const handleViewRoomDetails = () => {
    console.log('View Room Details pressed');
    setIsBurgerNavVisible(false);
    // Add your room details logic here
  };

  const handleContactInfo = () => {
    console.log('Contact Info pressed');
    setIsBurgerNavVisible(false);
    // Add your contact info logic here
  };

  const handleNotifications = () => {
    console.log('Notifications Settings pressed');
    setIsBurgerNavVisible(false);
    // Add your notifications logic here
  };

  const handleChangePassword = () => {
    console.log('Change Password pressed');
    setIsBurgerNavVisible(false);
    // Add your change password logic here
  };

  const handleLogout = () => {
    console.log('Logout pressed');
    setIsBurgerNavVisible(false);
    
    // Clear any user data/session here
    // For now, we'll just navigate back to LoginScreen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const DashboardUI = () => (
    <ScrollView contentContainerStyle={styles.dashboardContent}>
      <Text style={styles.greeting}>Hello, <Text style={styles.greetingAccent}>{userName}</Text></Text>
      <TenantInfoHeader 
        roomNumber="209" 
        contractDate="Dec 2025"
        showLogo={false}
        headerTitle={null}
        containerStyle={styles.tenantInfoContainer}
        roomInfoStyle={styles.tenantRoomInfo}
      />

      {/* Rent Status Card using reusable InfoCard component */}
      <InfoCard
        title="Rent Status"
        leftColumn={[
          {
            label: "Current Balance",
            date: "8/27/25",
            value: "₱ 2700"
          }
        ]}
        rightColumn={[
          {
            label: "Last Payment",
            date: "8/27/25",
            value: "₱ 1965"
          }
        ]}
        ctaText="↗ View More"
        onCtaPress={handleViewMore}
      />

      <Text style={styles.sectionTitle}>Announcements ↗</Text>

      {/* Water Interruption Announcement */}
      <AnnouncementCard
        dateText="24 Aug 10:00"
        statusLabel="Upcoming"
        title="Water Interruption"
        subtitle="August 25, 2025 - 2:00PM to 6:00PM"
        body="Maintenance by VECO. Please store water in advance. Thx >>"
        footer="Posted By: Landlord"
      />

      {/* Reminder Announcement */}
      <AnnouncementCard
        dateText="24 Aug 10:00"
        statusLabel="Active"
        title="Reminder"
        subtitle="August 25, 2025 - 2:00PM to 6:00PM"
        body="Please submit rent payment on or before August 30, thank you."
        footer="Posted By: Landlord"
      />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNav
        userName={userName}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
        onMenuPress={handleMenuPress}
      />
      
      <View style={styles.content}>
        {activeTab === 'dashboard' && <DashboardUI />}
        {activeTab === 'myroom' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>My Room Screen</Text>
            <Text style={styles.placeholderSubtext}>Room details and management</Text>
          </View>
        )}
        {activeTab === 'rules' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Rules Screen</Text>
            <Text style={styles.placeholderSubtext}>Coming soon...</Text>
          </View>
        )}
        {activeTab === 'request' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Request Screen</Text>
            <Text style={styles.placeholderSubtext}>Submit maintenance requests</Text>
          </View>
        )}
        {activeTab === 'payment' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Payment Screen</Text>
            <Text style={styles.placeholderSubtext}>Manage your payments</Text>
          </View>
        )}
      </View>

      <BotNav activeTab={activeTab} onTabPress={handleTabPress} />
      
      <BurgerNav
        visible={isBurgerNavVisible}
        onClose={handleCloseBurgerNav}
        onViewRoomDetails={handleViewRoomDetails}
        onContactInfo={handleContactInfo}
        onNotifications={handleNotifications}
        onChangePassword={handleChangePassword}
        onLogout={handleLogout}
        userName={userName}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  dashboardContent: {
    padding: 20,
    gap: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  greetingAccent: {
    color: '#FF6B35', // Orange color from image
  },
  tenantInfoContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 0,
  },
  tenantRoomInfo: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8, // Reduced from 16 to 8 to decrease gap
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  placeholderText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default TenantDashboard;