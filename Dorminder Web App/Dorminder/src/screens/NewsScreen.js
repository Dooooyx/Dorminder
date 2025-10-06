import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import BotNav from '../components/BotNav';

const NewsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('news');

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

  const newsItems = [
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

  const NewsCard = ({ newsItem }) => (
    <View style={styles.newsCard}>
      <View style={[styles.colorBar, { backgroundColor: newsItem.color }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>{newsItem.date}</Text>
          <View style={[styles.statusTag, { backgroundColor: newsItem.color }]}>
            <Text style={styles.statusText}>{newsItem.status}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{newsItem.title}</Text>
        <Text style={styles.schedule}>{newsItem.schedule}</Text>
        <Text style={styles.description}>{newsItem.description}</Text>
        <Text style={styles.postedBy}>Posted By: {newsItem.postedBy}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo/logo_dorminder.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>News</Text>
          <Text style={styles.subtitle}>
            View important updates, and official notices from the landlord in one place.
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.newsList}>
          {newsItems.map((newsItem) => (
            <NewsCard key={newsItem.id} newsItem={newsItem} />
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  textContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  logo: {
    width: 140,
    height: 45,
  },
  title: {
    fontSize: 35,
    fontWeight: '600',
    color: '#3D5A80',
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'left',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  newsList: {
    paddingBottom: 20,
  },
  newsCard: {
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
  cardTitle: {
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

export default NewsScreen;
