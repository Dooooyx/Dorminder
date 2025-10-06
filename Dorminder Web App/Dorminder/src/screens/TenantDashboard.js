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
import TopNav from '../components/TopNav';
import BotNav from '../components/BotNav';
import InfoCard from '../components/InfoCard';
import AnnouncementCard from '../components/AnnouncementCard';
import BurgerNav from '../components/BurgerNav';
import TenantInfoHeader from '../components/TenantInfoHeader';
import { authService } from '../services/auth';
import { tenantDataService } from '../services/tenantDataService';
import { billingService } from '../services/billingService';
import BillBreakdownModal from '../components/BillBreakdownModal';

const TenantDashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isBurgerNavVisible, setIsBurgerNavVisible] = React.useState(false);
  
  // Dynamic data state
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Billing state
  const [currentBalance, setCurrentBalance] = useState(0);
  const [bills, setBills] = useState([]);
  const [isBillBreakdownVisible, setIsBillBreakdownVisible] = useState(false);
  
  // Get current user
  const currentUser = authService.getCurrentUser();
  const userName = dashboardData?.tenant?.firstName || 'Loading...';

  // Fetch tenant dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        console.log('👤 Current user UID:', currentUser.uid);
        
        // Fetch dashboard data and billing data in parallel
        const [dashboardResult, billingResult] = await Promise.all([
          tenantDataService.getTenantDashboardData(currentUser.uid),
          billingService.getTenantCurrentBalance(currentUser.uid)
        ]);
        
        if (dashboardResult.success) {
          setDashboardData(dashboardResult.data);
        } else {
          setError(dashboardResult.error || 'Failed to load dashboard data');
        }

        if (billingResult.success) {
          setCurrentBalance(billingResult.data.totalBalance);
          setBills(billingResult.data.bills);
        } else {
          console.error('Error loading billing data:', billingResult.error);
          // Don't set error for billing, just use default values
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'news') {
      navigation.navigate('NewsScreen');
    } else if (tabId === 'rules') {
      navigation.navigate('TenantRules');
    } else if (tabId === 'request') {
      navigation.navigate('TenantRequests');
    } else if (tabId === 'payment') {
      navigation.navigate('TenantPayment');
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
    console.log('View More pressed - showing bill breakdown');
    // Show Bill Breakdown modal instead of navigating to payment screen
    setIsBillBreakdownVisible(true);
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
    setIsBurgerNavVisible(false);
    navigation.navigate('ContactInfoScreen');
  };

  const handleNotifications = () => {
    console.log('Notifications Settings pressed');
    setIsBurgerNavVisible(false);
    // Add your notifications logic here
  };

  const handleChangePassword = () => {
    setIsBurgerNavVisible(false);
    navigation.navigate('ChangePasswordScreen');
  };

  const handleLogout = async () => {
    console.log('Logout pressed');
    setIsBurgerNavVisible(false);
    
    try {
      await authService.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const DashboardUI = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!dashboardData) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No data available</Text>
        </View>
      );
    }

    const { tenant, room, rent, newsItems } = dashboardData;
    
    // Debug logging
    console.log('Dashboard data received:', {
      tenant,
      room,
      rent,
      newsItems
    });
    
    // Format room number
    const roomNumber = room?.roomNumber || tenant?.roomNumber || 'N/A';
    
    // Format lease end date
    const leaseEndDate = tenantDataService.formatDate(tenant?.leaseEndDate);
    
    // Get current balance from bills (real-time data)
    const balanceFromBills = currentBalance;
    const balanceDetails = rent?.balanceDetails;
    
    console.log('Balance info:', {
      balanceFromBills,
      balanceDetails,
      monthlyRent: tenant?.monthlyRent,
      leaseStartDate: tenant?.leaseStartDate,
      billsCount: bills.length
    });
    
    // Format last payment
    const lastPayment = rent?.lastPayment;
    const lastPaymentDate = lastPayment ? tenantDataService.formatDate(lastPayment.createdAt) : 'N/A';
    const lastPaymentAmount = lastPayment ? tenantDataService.formatCurrency(lastPayment.amount) : '₱ 0';
    
    // Format next due date and payment amount
    const nextDueDate = balanceDetails?.nextDueDate ? 
      tenantDataService.formatDate(balanceDetails.nextDueDate) : 'N/A';
    const nextPaymentAmount = balanceDetails?.nextPaymentAmount || tenant?.monthlyRent || 0;

    return (
      <ScrollView contentContainerStyle={styles.dashboardContent}>
        <Text style={styles.greeting}>Hello, <Text style={styles.greetingAccent}>{tenant?.firstName || 'Tenant'}</Text></Text>
        <TenantInfoHeader 
          roomNumber={roomNumber} 
          contractDate={leaseEndDate}
          showLogo={false}
          headerTitle={null}
          containerStyle={styles.tenantInfoContainer}
          roomInfoStyle={styles.tenantRoomInfo}
        />

        {/* Current Balance Card using reusable InfoCard component */}
        <InfoCard
          title="Current Balance"
          leftColumn={[
            {
              label: "Outstanding Balance",
              date: "From Bills",
              value: balanceFromBills > 0 ? billingService.formatCurrency(balanceFromBills) : "₱ 0"
            }
          ]}
          rightColumn={[
            {
              label: "Bills Count",
              date: "Active Bills",
              value: bills.length.toString()
            }
          ]}
          ctaText="↗ Learn More"
          onCtaPress={handleViewMore}
        />

        <Text style={styles.sectionTitle}>News ↗</Text>

        {/* Dynamic News */}
        {newsItems && newsItems.length > 0 ? (
          newsItems.map((newsItem, index) => (
            <AnnouncementCard
              key={newsItem.id || index}
              dateText={tenantDataService.formatDate(newsItem.createdAt)}
              statusLabel={newsItem.status || 'Active'}
              title={newsItem.title || 'News'}
              subtitle={newsItem.subtitle || ''}
              body={newsItem.body || newsItem.content || ''}
              footer={`Posted By: ${newsItem.postedBy || 'Landlord'}`}
            />
          ))
        ) : (
          <View style={styles.noAnnouncementsContainer}>
            <Text style={styles.noAnnouncementsText}>No news at this time</Text>
          </View>
        )}
      </ScrollView>
    );
  };

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

      {/* Bill Breakdown Modal */}
      <BillBreakdownModal
        visible={isBillBreakdownVisible}
        onClose={() => setIsBillBreakdownVisible(false)}
        tenantId={currentUser?.uid}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
  noAnnouncementsContainer: {
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
  },
  noAnnouncementsText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default TenantDashboard;