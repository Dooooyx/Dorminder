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

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const userName = 'Chrystls';

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
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
    // Add your menu logic here
  };

  const handleViewMore = () => {
    console.log('View More pressed');
    // Add your view more logic here
  };

  const DashboardUI = () => (
    <ScrollView contentContainerStyle={styles.dashboardContent}>
      <Text style={styles.greeting}>Hello, <Text style={styles.greetingAccent}>{userName}</Text></Text>
      <Text style={styles.subInfo}>Room 209  |  Contract until: Dec 2025</Text>

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

      {/* Announcement Card using reusable AnnouncementCard component */}
      <AnnouncementCard
        dateText="24 Aug 10:00"
        statusLabel="Upcoming"
        title="🔧 Water Interruption"
        subtitle="August 25, 2025 - 2:00PM to 6:00PM"
        body="Maintenance by MCWD. Please store water in advance. Thx :>>"
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
    color: '#EE6C4D',
  },
  subInfo: {
    fontSize: 16,
    color: '#6b7280',
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