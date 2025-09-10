import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const TenantRequests = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [userName] = useState('Chrystis');

  // Mock data for ongoing requests
  const ongoingRequests = [
    {
      id: '1',
      type: 'Room Cleaning',
      roomNumber: '209',
      date: '09/04/25',
      status: 'ongoing',
      priority: 'medium',
      description: 'General room cleaning and organization',
    },
    {
      id: '2',
      type: 'Airconditioning Cleaning',
      roomNumber: '209',
      date: '09/04/25',
      status: 'ongoing',
      priority: 'high',
      description: 'AC unit needs thorough cleaning',
    },
    {
      id: '3',
      type: 'Door Repair',
      roomNumber: '209',
      date: '09/04/25',
      status: 'ongoing',
      priority: 'low',
      description: 'Door handle is loose and needs fixing',
    },
  ];

  // Mock data for completed requests
  const completedRequests = [
    {
      id: '4',
      type: 'Room Cleaning',
      roomNumber: '209',
      date: '09/04/25',
      status: 'completed',
      priority: 'medium',
      description: 'General room cleaning and organization',
    },
    {
      id: '5',
      type: 'Airconditioning Cleaning',
      roomNumber: '209',
      date: '09/04/25',
      status: 'completed',
      priority: 'high',
      description: 'AC unit needs thorough cleaning',
    },
    {
      id: '6',
      type: 'Airconditioning Maintenance',
      roomNumber: '209',
      date: '09/04/25',
      status: 'completed',
      priority: 'medium',
      description: 'Regular AC maintenance check',
    },
    {
      id: '7',
      type: 'Door Repair',
      roomNumber: '209',
      date: '09/04/25',
      status: 'completed',
      priority: 'low',
      description: 'Door handle is loose and needs fixing',
    },
  ];

  const handleTabPress = (tabId) => {
    if (tabId === 'ongoing' || tabId === 'completed') {
      setActiveTab(tabId);
    } else if (tabId === 'dashboard') {
      navigation.navigate('TenantDashboard');
    } else if (tabId === 'rules') {
      navigation.navigate('TenantRules');
    } else if (tabId === 'payment') {
      // Placeholder for payment screen
      console.log('Payment tab pressed');
    } else if (tabId === 'myroom') {
      // Placeholder for my room screen
      console.log('My Room tab pressed');
    }
  };

  const handleNewRequest = () => {
    navigation.navigate('NewRequestForm');
  };


  const currentRequests = activeTab === 'ongoing' ? ongoingRequests : completedRequests;
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
              onPress={() => console.log('Request pressed:', request.id)}
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
