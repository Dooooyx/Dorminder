import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import BotNav from '../components/BotNav';
import RequestCard from '../components/RequestCard';
import RequestTabBar from '../components/RequestTabBar';
import FloatingActionButton from '../components/FloatingActionButton';
import { authService } from '../services/auth';
import { requestService } from '../services/requestService';

const { width } = Dimensions.get('window');

const TenantRequests = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user) return;
        const res = await requestService.getTenantRequests(user.uid);
        if (res.success) setRequests(res.requests);
      } catch (e) {
        console.log('Failed to load requests', e);
      }
    };
    load();
  }, []);

  const handleTabPress = (tabId) => {
    if (tabId === 'ongoing' || tabId === 'completed') {
      setActiveTab(tabId);
    } else if (tabId === 'dashboard') {
      navigation.navigate('TenantDashboard');
    } else if (tabId === 'announcement') {
      navigation.navigate('AnnouncementsScreen');
    } else if (tabId === 'rules') {
      navigation.navigate('TenantRules');
    } else if (tabId === 'payment') {
      navigation.navigate('TenantPayment');
    }
  };

  const handleNewRequest = () => {
    navigation.navigate('NewRequestForm');
  };


  const [expandedId, setExpandedId] = useState(null);
  const currentRequests = requests.filter(r => (activeTab === 'ongoing' ? r.status !== 'completed' : r.status === 'completed'));
  const subtitle = activeTab === 'ongoing' 
    ? 'Submit your requests here' 
    : 'Requests that the landlord had completed.';

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image
            source={require('../assets/logo/logo_dorminder.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.titleSection}>
            <Text style={styles.sectionTitle}>Requests</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        {/* Tab Bar */}
        <RequestTabBar
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />

        {/* Request List */}
        <View style={styles.requestList}>
          {currentRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              expanded={expandedId === request.id}
              onPress={() => setExpandedId(expandedId === request.id ? null : request.id)}
            />
          ))}
        </View>

        {/* Bottom Spacing for FAB */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleNewRequest} />

      {/* Bottom Navigation */}
      <BotNav activeTab="request" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 160,
    height: 50,
    marginBottom: 20,
  },
  titleSection: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 35,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'left',
  },
  requestList: {
    marginTop: 20,
  },
  bottomSpacing: {
    height: 100, // Space for FAB
  },
});

export default TenantRequests;
