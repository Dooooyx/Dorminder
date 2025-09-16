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
import TenantInfoHeader from '../components/TenantInfoHeader';
import TopNav from '../components/TopNav';
import BotNav from '../components/BotNav';
import { authService } from '../services/auth';
import { tenantDataService } from '../services/tenantDataService';

const TenantPayment = ({ navigation }) => {
  const [activePaymentTab, setActivePaymentTab] = useState('bills');
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get current user
  const currentUser = authService.getCurrentUser();
  const userName = tenantData?.firstName || 'Tenant';

  const handleTabPress = (tabId) => {
    if (tabId === 'dashboard') {
      navigation.navigate('TenantDashboard');
    } else if (tabId === 'rules') {
      navigation.navigate('TenantRules');
    } else if (tabId === 'request') {
      navigation.navigate('TenantRequests');
    } else if (tabId === 'payment') {
      // Already on payment screen, do nothing
      return;
    }
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  // Fetch tenant data
  useEffect(() => {
    const fetchTenantData = async () => {
      if (!currentUser) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        console.log('Getting tenant data for user:', currentUser.uid);
        const tenantResult = await tenantDataService.getTenantData(currentUser.uid);
        
        if (!tenantResult.success) {
          console.log('Tenant not found:', tenantResult.error);
          setError('Tenant data not found. Please contact your landlord.');
          setLoading(false);
          return;
        }
        
        const tenant = tenantResult.data;
        console.log('Tenant data:', tenant);
        setTenantData(tenant);
        
      } catch (error) {
        console.error('Error fetching tenant data:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [currentUser]);

  // Mock data for bills
  const billsData = [
    { month: 'Sept 2025', amount: 'PHP 1,565.56', status: 'pending' },
    { month: 'Aug 2025', amount: 'PHP 1,565.56', status: 'paid' },
    { month: 'July 2025', amount: 'PHP 1,565.56', status: 'paid' },
    { month: 'June 2025', amount: 'PHP 1,565.56', status: 'pending' },
    { month: 'May 2025', amount: 'PHP 1,565.56', status: 'pending' },
  ];

  // Mock data for payments
  const paymentsData = [
    { amount: 'PHP 1,565.56', date: 'Sat, 08/30, 7:30 AM', status: 'completed' },
    { amount: 'PHP 1,565.56', date: 'Sat, 07/30, 7:30 AM', status: 'completed' },
    { amount: 'PHP 1,565.56', date: 'Sat, 06/30, 7:30 AM', status: 'completed' },
    { amount: 'PHP 1,565.56', date: 'Sat, 05/30, 7:30 AM', status: 'completed' },
    { amount: 'PHP 1,565.56', date: 'Sat, 04/30, 7:30 AM', status: 'completed' },
    { amount: 'PHP 1,565.56', date: 'Sat, 03/30, 7:30 AM', status: 'completed' },
    { amount: 'PHP 1,565.56', date: 'Sat, 02/30, 7:30 AM', status: 'completed' },
    { amount: 'PHP 1,565.56', date: 'Sat, 01/30, 7:30 AM', status: 'completed' },
    { amount: 'PHP 1,565.56', date: 'Sat, 12/30, 7:30 AM', status: 'completed' },
    { amount: 'PHP 1,565.56', date: 'Sat, 11/30, 7:30 AM', status: 'completed' },
    { amount: 'PHP 1,565.56', date: 'Sat, 10/30, 7:30 AM', status: 'completed' },
  ];

  const BillCard = ({ bill }) => (
    <View style={styles.billCard}>
      <View style={styles.billContent}>
        <View style={styles.billLeft}>
          <Text style={styles.billMonth}>{bill.month}</Text>
          <Text style={styles.billAmount}>{bill.amount}</Text>
        </View>
        <View style={styles.billRight}>
          <View style={[
            styles.downloadIcon,
            bill.status === 'paid' ? styles.downloadIconPaid : styles.downloadIconPending
          ]}>
            <Text style={[
              styles.downloadIconText,
              bill.status === 'paid' ? styles.downloadIconTextPaid : styles.downloadIconTextPending
            ]}>↓</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const PaymentItem = ({ payment }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentLeft}>
        <Text style={styles.paymentAmount}>{payment.amount}</Text>
      </View>
      <View style={styles.paymentCenter}>
        <Text style={styles.paymentDate}>{payment.date}</Text>
      </View>
      <View style={styles.paymentRight}>
        <View style={styles.checkIcon}>
          <Text style={styles.checkIconText}>✓</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading payment data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bills</Text>
      </View>

      {/* Bill Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View style={styles.summaryLeft}>
            <Text style={styles.dormitoryText}>Dormitory</Text>
            <Text style={styles.accountNumber}>120155111</Text>
          </View>
          <View style={styles.summaryRight}>
            <Image 
              source={require('../assets/logo/logo_dorminder.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.summaryBottom}>
          <View style={styles.summaryBottomLeft}>
            <Text style={styles.rentDueText}>Rent Due:</Text>
            <Text style={styles.rentAmount}>2,711.51</Text>
          </View>
          <View style={styles.summaryBottomRight}>
            <Text style={styles.dueDate}>10/30/2025</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activePaymentTab === 'bills' && styles.activeTab]}
          onPress={() => setActivePaymentTab('bills')}
        >
          <Text style={[styles.tabText, activePaymentTab === 'bills' && styles.activeTabText]}>
            Bills
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activePaymentTab === 'payments' && styles.activeTab]}
          onPress={() => setActivePaymentTab('payments')}
        >
          <Text style={[styles.tabText, activePaymentTab === 'payments' && styles.activeTabText]}>
            Payments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activePaymentTab === 'bills' ? (
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.billsContainer}>
              {billsData.map((bill, index) => (
                <BillCard key={index} bill={bill} />
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.paymentsContainer}>
              <Text style={styles.yearText}>2025</Text>
              {paymentsData.map((payment, index) => (
                <PaymentItem key={index} payment={payment} />
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <BotNav activeTab="payment" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a', // Dark blue background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryLeft: {
    flex: 1,
  },
  dormitoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  logo: {
    width: 80,
    height: 30,
  },
  summaryBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryBottomLeft: {
    flex: 1,
  },
  rentDueText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  rentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626', // Red color
  },
  summaryBottomRight: {
    alignItems: 'flex-end',
  },
  dueDate: {
    fontSize: 14,
    color: '#9ca3af',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#1e3a8a',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  billsContainer: {
    padding: 16,
  },
  billCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  billContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  billLeft: {
    flex: 1,
  },
  billMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  billAmount: {
    fontSize: 14,
    color: '#6b7280',
  },
  billRight: {
    alignItems: 'center',
  },
  downloadIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIconPaid: {
    backgroundColor: '#10b981', // Green background
  },
  downloadIconPending: {
    backgroundColor: '#f3f4f6', // Gray background
  },
  downloadIconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadIconTextPaid: {
    color: '#fff',
  },
  downloadIconTextPending: {
    color: '#6b7280',
  },
  paymentsContainer: {
    padding: 16,
  },
  yearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  paymentLeft: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  paymentCenter: {
    flex: 1,
    alignItems: 'center',
  },
  paymentDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default TenantPayment;
