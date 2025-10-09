import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import BotNav from '../components/BotNav';
import { tenantDataService } from '../services/tenantDataService';
import { authService } from '../services/auth';
import { fonts } from '../utils/fonts';

const ContactInfoScreen = ({ navigation }) => {
  const [landlordInfo, setLandlordInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleTabPress = (tabId) => {
    if (tabId === 'dashboard') {
      navigation.navigate('TenantDashboard');
    } else if (tabId === 'news') {
      navigation.navigate('NewsScreen');
    } else if (tabId === 'rules') {
      navigation.navigate('TenantRules');
    } else if (tabId === 'request') {
      navigation.navigate('TenantRequests');
    } else if (tabId === 'payment') {
      navigation.navigate('TenantPayment');
    }
  };

  useEffect(() => {
    const fetchLandlordInfo = async () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          setError('User not authenticated');
          return;
        }

        const tenantData = await tenantDataService.getTenantData(currentUser.uid);
        if (tenantData && tenantData.landlordId) {
          // Fetch landlord information
          const landlordData = await tenantDataService.getLandlordData(tenantData.landlordId);
          setLandlordInfo({
            name: landlordData?.firstName && landlordData?.lastName 
              ? `${landlordData.firstName} ${landlordData.lastName}` 
              : tenantData.landlordName || 'Landlord',
            email: tenantData.landlordEmail || 'Not available',
            phone: landlordData?.phoneNumber || tenantData.landlordPhone || 'Not available',
            propertyName: tenantData.propertyName || 'Property',
            address: landlordData?.address || tenantData.propertyAddress || 'Not available'
          });
        } else {
          setError('Landlord information not found');
        }
      } catch (err) {
        console.error('Error fetching landlord info:', err);
        setError('Failed to load landlord information');
      } finally {
        setLoading(false);
      }
    };

    fetchLandlordInfo();
  }, []);

  const handleCall = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== 'Not available') {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert('No Phone Number', 'Phone number is not available');
    }
  };

  const handleEmail = (email) => {
    if (email && email !== 'Not available') {
      Linking.openURL(`mailto:${email}`);
    } else {
      Alert.alert('No Email', 'Email address is not available');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <View style={styles.backButtonIcon}>
              <Text style={styles.backArrow}>←</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Info</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B47" />
          <Text style={styles.loadingText}>Loading contact information...</Text>
        </View>
        <BotNav activeTab="dashboard" onTabPress={handleTabPress} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <View style={styles.backButtonIcon}>
              <Text style={styles.backArrow}>←</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Info</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
        <BotNav activeTab="dashboard" onTabPress={handleTabPress} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <View style={styles.backButtonIcon}>
            <Text style={styles.backArrow}>←</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Info</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Landlord Information</Text>
          <Text style={styles.subtitle}>Contact details for your landlord</Text>

          {/* Landlord Name */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Landlord Name</Text>
            <Text style={styles.infoValue}>{landlordInfo?.name}</Text>
          </View>

          {/* Property Name */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Property</Text>
            <Text style={styles.infoValue}>{landlordInfo?.propertyName}</Text>
          </View>

          {/* Property Address */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Property Address</Text>
            <Text style={styles.infoValue}>{landlordInfo?.address}</Text>
          </View>

          {/* Contact Actions */}
          <View style={styles.contactActions}>
            {/* Phone Contact */}
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleCall(landlordInfo?.phone)}
              activeOpacity={0.8}
            >
              <View style={styles.contactIcon}>
                <Text style={styles.contactIconText}>📞</Text>
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactTitle}>Call Landlord</Text>
                <Text style={styles.contactSubtitle}>
                  {landlordInfo?.phone || 'Phone not available'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Email Contact */}
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleEmail(landlordInfo?.email)}
              activeOpacity={0.8}
            >
              <View style={styles.contactIcon}>
                <Text style={styles.contactIconText}>✉️</Text>
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactTitle}>Email Landlord</Text>
                <Text style={styles.contactSubtitle}>
                  {landlordInfo?.email || 'Email not available'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Additional Info */}
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoTitle}>Need Help?</Text>
            <Text style={styles.additionalInfoText}>
              If you need immediate assistance or have urgent maintenance issues, 
              please contact your landlord directly using the methods above.
            </Text>
          </View>
        </View>
      </ScrollView>

      <BotNav activeTab="dashboard" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
  },
  backButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: '#4A5568',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4A5568',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B47',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: '#1A202C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#718096',
    marginBottom: 32,
    lineHeight: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    color: '#2D3748',
    fontWeight: '500',
  },
  contactActions: {
    marginTop: 8,
    marginBottom: 32,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B47',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactIconText: {
    fontSize: 20,
  },
  contactDetails: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#718096',
  },
  additionalInfo: {
    backgroundColor: '#EDF2F7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B47',
  },
  additionalInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  additionalInfoText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
});

export default ContactInfoScreen;
