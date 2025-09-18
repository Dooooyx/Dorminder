import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import BotNav from '../components/BotNav';

const AnnouncementsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('announcement');

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'dashboard') {
      navigation.navigate('TenantDashboard');
    } else if (tabId === 'rules') {
      navigation.navigate('TenantRules');
    } else if (tabId === 'request') {
      navigation.navigate('TenantRequests');
    } else if (tabId === 'payment') {
      navigation.navigate('TenantPayment');
    }
  };

  const announcements = [
    {
      id: 1,
      type: 'water',
      status: 'Upcoming',
      date: '24 Aug 10:00PM',
      title: 'Water Interruption',
      schedule: 'August 25, 2025 - 2:00PM to 6:00PM',
      description: 'Maintenance by MCWD. Please store water in advance. Thx :>>',
      postedBy: 'Landlord',
      color: '#1E40AF', // Blue color
    },
    {
      id: 2,
      type: 'reminder',
      status: 'Active',
      date: '24 Aug 10:00PM',
      title: 'Reminder',
      schedule: 'August 25, 2025 - 2:00PM to 6:00PM',
      description: 'Please ubmit rent payment on or before August 30, thank you.',
      postedBy: 'Landlord',
      color: '#EA580C', // Orange color
    },
    {
      id: 3,
      type: 'water',
      status: 'Upcoming',
      date: '24 Aug 10:00PM',
      title: 'Water Interruption',
      schedule: 'August 25, 2025 - 2:00PM to 6:00PM',
      description: 'Maintenance by MCWD. Please store water in advance. Thx :>>',
      postedBy: 'Landlord',
      color: '#1E40AF', // Blue color
    },
    {
      id: 4,
      type: 'reminder',
      status: 'Active',
      date: '24 Aug 10:00PM',
      title: 'Reminder',
      schedule: 'August 25, 2025 - 2:00PM to 6:00PM',
      description: 'Please ubmit rent payment on or before August 30, thank you.',
      postedBy: 'Landlord',
      color: '#EA580C', // Orange color
    },
  ];

  const AnnouncementCard = ({ announcement }) => (
    <View style={styles.announcementCard}>
      <View style={[styles.colorBar, { backgroundColor: announcement.color }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>{announcement.date}</Text>
          <View style={[styles.statusTag, { backgroundColor: announcement.color }]}>
            <Text style={styles.statusText}>{announcement.status}</Text>
          </View>
        </View>
        <Text style={styles.title}>{announcement.title}</Text>
        <Text style={styles.schedule}>{announcement.schedule}</Text>
        <Text style={styles.description}>{announcement.description}</Text>
        <Text style={styles.postedBy}>Posted By: {announcement.postedBy}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandName}>Dorminder</Text>
        <Text style={styles.title}>Announcements</Text>
        <Text style={styles.subtitle}>
          View important updates, and official notices from the landlord in one place.
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.announcementsList}>
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </View>
      </ScrollView>

      <BotNav activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  announcementsList: {
    paddingBottom: 20,
  },
  announcementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
    backgroundColor: '#1E40AF',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#1E40AF',
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  schedule: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  postedBy: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});

export default AnnouncementsScreen;
