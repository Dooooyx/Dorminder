import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import TenantInfoHeader from '../components/TenantInfoHeader';
import TopNav from '../components/TopNav';
import BotNav from '../components/BotNav';
import { authService } from '../services/auth';
import { rulesService } from '../services/rulesService';
import { fonts } from '../utils/fonts';
import { useTenantData } from '../hooks/useTenantData';
import { handleTabNavigation, handleNotificationPress, handleProfilePress, handleMenuPress } from '../utils/navigation';
import { commonStyles } from '../styles/commonStyles';

const TenantRules = ({ navigation }) => {
  const [activeTab, setActiveTab] = React.useState('rules');
  const [rules, setRules] = useState([]);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [rulesError, setRulesError] = useState('');
  
  // Use custom hook for tenant data
  const { tenantData, loading, error, userName } = useTenantData();

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    handleTabNavigation(navigation, tabId, 'TenantRules');
  };

  const handleNotificationPressWrapper = () => {
    handleNotificationPress();
  };

  const handleProfilePressWrapper = () => {
    handleProfilePress(navigation);
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
    // Add your menu logic here
  };

  // Fetch rules data
  useEffect(() => {
    const fetchRules = async () => {
      if (!currentUser) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        // Get tenant data to find property ID
        console.log('Getting tenant data for user:', currentUser.uid);
        const tenantResult = await tenantDataService.getTenantData(currentUser.uid);
        
        if (!tenantResult.success) {
          console.log('Tenant not found:', tenantResult.error);
          setError('Tenant data not found. Please contact your landlord.');
          setLoading(false);
          return;
        }
        
        const tenant = tenantResult.data;
        const propertyId = tenant.propertyId;
        
        console.log('Tenant property ID:', propertyId);
        console.log('Tenant data:', tenant);
        
        // Store tenant data for use in TenantInfoHeader
        setTenantData(tenant);
        
        if (!propertyId) {
          setError('Property ID not found in tenant data');
          setLoading(false);
          return;
        }
        
        const result = await rulesService.getRulesByProperty(propertyId);
        
        if (result.success) {
          console.log('Rules data received:', result.data);
          setRules(result.data);
        } else {
          console.log('Rules error:', result.error);
          setError(result.error || 'Failed to load rules');
        }
      } catch (error) {
        console.error('Error fetching rules:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [currentUser]);

  const RuleSection = ({ rule }) => {
    if (!rule) {
      return null;
    }
    
    const iconEmoji = rulesService.getIconEmoji(rule.icon || 'checkmark');
    const ruleTitle = rule.title || 'Untitled Rule';
    const ruleDescription = rule.description || '';
    const ruleItems = rule.rules || [];
    
    return (
      <View style={styles.ruleSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>{iconEmoji}</Text>
          <Text style={styles.sectionTitle}>{ruleTitle}</Text>
        </View>
        {ruleDescription ? (
          <Text style={styles.sectionDescription}>{ruleDescription}</Text>
        ) : null}
        <View style={styles.rulesList}>
          {ruleItems.map((ruleItem, index) => {
            const ruleNumber = (index + 1) + '.';
            return (
              <View key={index} style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>{ruleNumber}</Text>
                <Text style={styles.ruleText}>{ruleItem || ''}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Show TenantInfoHeader only for rules tab, TopNav for other tabs */}
      {activeTab === 'rules' ? (
        <TenantInfoHeader 
          roomNumber={tenantData?.roomNumber || 'N/A'} 
          contractDate={tenantData?.leaseEndDate ? 
            tenantDataService.formatDate(tenantData.leaseEndDate) : 'N/A'
          }
          showLogo={true}
          headerTitle={null}
          containerStyle={styles.tenantInfoContainer}
          roomInfoStyle={styles.tenantRoomInfo}
        />
      ) : (
        <TopNav
          userName={userName}
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
          onMenuPress={handleMenuPress}
        />
      )}
      
      <View style={styles.content}>
        {activeTab === 'rules' ? (
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.rulesContent}>
              {/* Main Title */}
              <Text style={styles.mainTitle}>Boarding House Rules & Regulations</Text>
              
              {/* Introduction */}
              <Text style={styles.introduction}>
                Welcome to your dormitory! Please read and follow the guidelines below to ensure a safe, respectful, and comfortable living environment.
              </Text>
              
              {/* Loading State */}
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#E53E3E" />
                  <Text style={styles.loadingText}>Loading rules...</Text>
                </View>
              ) : null}
              
              {/* Error State */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              {/* Rules Sections */}
              {!loading && !error && rules.length > 0 ? (
                <View>
                  {rules.map((rule) => (
                    <RuleSection
                      key={rule.id}
                      rule={rule}
                    />
                  ))}
                  
                  {/* Note Section */}
                  <View style={styles.noteSection}>
                    <View style={styles.noteHeader}>
                      <Text style={styles.noteIcon}>📎</Text>
                      <Text style={styles.noteTitle}>Note</Text>
                    </View>
                    <Text style={styles.noteText}>
                      Rules are subject to updates. Any changes will be announced in the Announcements page.
                    </Text>
                  </View>
                </View>
              ) : null}
              
              {/* No Rules State */}
              {!loading && !error && rules.length === 0 ? (
                <View style={styles.noRulesContainer}>
                  <Text style={styles.noRulesIcon}>📋</Text>
                  <Text style={styles.noRulesTitle}>No Rules Available</Text>
                  <Text style={styles.noRulesText}>
                    Rules haven't been set up yet. Please contact your landlord.
                  </Text>
                </View>
              ) : null}
            </View>
          </ScrollView>
        ) : null}
        
        {activeTab === 'myroom' ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>My Room Screen</Text>
            <Text style={styles.placeholderSubtext}>Room details and management</Text>
          </View>
        ) : null}
        
        {activeTab === 'request' ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Request Screen</Text>
            <Text style={styles.placeholderSubtext}>Submit maintenance requests</Text>
          </View>
        ) : null}
        
        {activeTab === 'payment' ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Payment Screen</Text>
            <Text style={styles.placeholderSubtext}>Manage your payments</Text>
          </View>
        ) : null}
      </View>

      <BotNav activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Plain white background
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  rulesContent: {
    padding: 20,
    paddingBottom: 100, // Space for bottom navigation
  },
  tenantInfoContainer: {
    paddingHorizontal: 20, // Match content padding
  },
  tenantRoomInfo: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 0, // Remove default margin
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: '#E53E3E', // Reddish-orange color from image
    marginBottom: 12,
    textAlign: 'left',
  },
  introduction: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'left',
  },
  ruleSection: {
    marginBottom: 24,
    // Removed card styling for plain white background
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: '#E53E3E', // Reddish-orange color from image
    flex: 1,
  },
  rulesList: {
    paddingLeft: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  ruleNumber: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: '#1f2937',
    marginRight: 8,
    minWidth: 20,
  },
  ruleText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#1f2937',
    lineHeight: 24,
    flex: 1,
  },
  noteSection: {
    marginTop: 20,
    // Removed card styling for plain white background
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: '#E53E3E', // Reddish-orange color from image
  },
  noteText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#1f2937',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 12,
    marginLeft: 36, // Align with rules list
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginVertical: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
  },
  noRulesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noRulesIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noRulesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  noRulesText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default TenantRules;
