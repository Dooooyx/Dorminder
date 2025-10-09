import React, { useState, useEffect } from 'react';
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
import { fonts } from '../utils/fonts';
import { handleTabNavigation } from '../utils/navigation';
import { commonStyles } from '../styles/commonStyles';
import { tenantDataService } from '../services/tenantDataService';
import { authService } from '../services/auth';

const NewsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('news');
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    handleTabNavigation(navigation, tabId, 'NewsScreen');
  };

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = authService.addAuthStateListener((user) => {
      setCurrentUser(user);
    });

    // Initial user check
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadNews();
    }
  }, [currentUser]);

  const loadNews = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading news for user:', currentUser?.uid);
      
      // Get tenant data first to get propertyId
      const tenantDataResult = await tenantDataService.getTenantData(currentUser?.uid);
      console.log('🏠 Tenant data result:', tenantDataResult);
      
      if (tenantDataResult.success && tenantDataResult.data?.propertyId) {
        console.log('📢 Fetching announcements for propertyId:', tenantDataResult.data.propertyId);
        const newsResult = await tenantDataService.getNews(tenantDataResult.data.propertyId);
        console.log('📰 News result:', newsResult);
        
        if (newsResult.success && newsResult.data.length > 0) {
          console.log('✅ Setting news items:', newsResult.data);
          setNewsItems(newsResult.data);
        } else {
          console.log('⚠️ No announcements found for propertyId, trying fallback query...');
          // Fallback: try to get all announcements (for debugging)
          try {
            const fallbackResult = await tenantDataService.getAllAnnouncements();
            if (fallbackResult.success && fallbackResult.data.length > 0) {
              console.log('🔧 Fallback found announcements:', fallbackResult.data);
              setNewsItems(fallbackResult.data);
            } else {
              console.log('🔧 No announcements found even with fallback');
              setNewsItems([]);
            }
          } catch (fallbackError) {
            console.error('❌ Fallback query failed:', fallbackError);
            setNewsItems([]);
          }
        }
      } else {
        console.error('❌ No propertyId found for tenant:', tenantDataResult);
      }
    } catch (error) {
      console.error('❌ Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString?.toDate?.() || dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTimeRange = (announcement) => {
    const parts = [];
    
    // Date range
    if (announcement.fromDate && announcement.untilDate) {
      const fromDate = formatDate(announcement.fromDate);
      const untilDate = formatDate(announcement.untilDate);
      parts.push(`${fromDate} to ${untilDate}`);
    } else if (announcement.fromDate) {
      parts.push(formatDate(announcement.fromDate));
    }
    
    // Time range
    if (announcement.fromTime && announcement.untilTime) {
      parts.push(`${announcement.fromTime} to ${announcement.untilTime}`);
    } else if (announcement.fromTime) {
      parts.push(`from ${announcement.fromTime}`);
    } else if (announcement.untilTime) {
      parts.push(`until ${announcement.untilTime}`);
    }
    
    return parts.length > 0 ? parts.join(' | ') : 'No time specified';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#10B981'; // Green
      case 'upcoming': return '#3B82F6'; // Blue
      default: return '#6B7280'; // Gray
    }
  };

  const NewsCard = ({ newsItem }) => (
    <View style={styles.newsCard}>
      <View style={[styles.colorBar, { backgroundColor: getStatusColor(newsItem.status) }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>{formatDate(newsItem.createdAt)}</Text>
          <View style={[styles.statusTag, { backgroundColor: getStatusColor(newsItem.status) }]}>
            <Text style={styles.statusText}>{newsItem.status}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{newsItem.title}</Text>
        <Text style={styles.schedule}>{formatTimeRange(newsItem)}</Text>
        <Text style={styles.description}>{newsItem.description}</Text>
        <Text style={styles.postedBy}>Posted By: {newsItem.postedBy || newsItem.landlordName || 'Landlord'}</Text>
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading news...</Text>
            </View>
          ) : newsItems.length > 0 ? (
            newsItems.map((newsItem) => (
              <NewsCard key={newsItem.id} newsItem={newsItem} />
            ))
          ) : (
            <View style={styles.noNewsContainer}>
              <Text style={styles.noNewsText}>No announcements at this time</Text>
              <Text style={styles.noNewsSubtext}>Check back later for updates from your landlord</Text>
            </View>
          )}
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
    fontFamily: fonts.semiBold,
    color: '#3D5A80',
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
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
    borderWidth: 1,
    borderColor: '#EBEEF3',
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
    fontFamily: fonts.medium,
    color: '#6B7280',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#1E40AF',
  },
  statusText: {
    fontSize: 10,
    fontFamily: fonts.semiBold,
    color: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: '#1F2937',
    marginBottom: 8,
  },
  schedule: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: '#6B7280',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  postedBy: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: '#6B7280',
  },
  noNewsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  noNewsText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  noNewsSubtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NewsScreen;
