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
import { billingService } from '../services/billingService';
import BillBreakdownModal from '../components/BillBreakdownModal';
import ReceiptModal from '../components/ReceiptModal';

const TenantPayment = ({ navigation }) => {
  const [activePaymentTab, setActivePaymentTab] = useState('bills');
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Billing state
  const [bills, setBills] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isBillBreakdownVisible, setIsBillBreakdownVisible] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [receiptText, setReceiptText] = useState('');
  
  // Get current user
  const currentUser = authService.getCurrentUser();
  const userName = tenantData?.firstName || 'Tenant';

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

  // Fetch tenant data and billing data
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        console.log('Getting tenant data for user:', currentUser.uid);
        
        // Fetch tenant data and billing data in parallel
        const [tenantResult, billingResult] = await Promise.all([
          tenantDataService.getTenantData(currentUser.uid),
          billingService.getBillBreakdown(currentUser.uid)
        ]);
        
        if (!tenantResult.success) {
          console.log('Tenant not found:', tenantResult.error);
          setError('Tenant data not found. Please contact your landlord.');
          setLoading(false);
          return;
        }
        
        const tenant = tenantResult.data;
        console.log('Tenant data:', tenant);
        setTenantData(tenant);
        
        if (billingResult.success) {
          setBills(billingResult.data);
          // Calculate current balance from pending/partially paid bills
          const balance = billingResult.data
            .filter(bill => bill.status === 'Pending' || bill.status === 'Partially Paid')
            .reduce((total, bill) => total + (bill.remainingBalance || bill.totalAmount), 0);
          setCurrentBalance(balance);
        } else {
          console.error('Error loading billing data:', billingResult.error);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Handle PDF download
  const handleDownloadPDF = async (bill) => {
    if (generatingPDF) return; // Prevent multiple simultaneous generations
    
    try {
      setGeneratingPDF(true);
      
      // Import simple receipt generator
      const { generateSimpleReceipt } = await import('../utils/simplePDFGenerator');
      
      // Generate receipt text
      const receipt = await generateSimpleReceipt(bill, tenantData);
      
      // Show receipt in modal
      setReceiptText(receipt);
      setIsReceiptModalVisible(true);
      
      console.log('Receipt generated successfully');
    } catch (error) {
      console.error('Error generating receipt:', error);
      
      // Fallback: Show basic bill details in alert
      const billDetails = `
Bill Receipt - ${bill.billingPeriod}

Amount: ${billingService.formatCurrency(bill.totalAmount)}
Status: ${bill.status}
Due Date: ${bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}
Room: ${bill.roomNumber}

${bill.status === 'Partially Paid' && bill.remainingBalance 
  ? `Remaining Balance: ${billingService.formatCurrency(bill.remainingBalance)}`
  : ''
}

This is your bill receipt. You can take a screenshot for your records.
      `;
      
      alert(billDetails);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const BillCard = ({ bill }) => (
    <TouchableOpacity 
      style={[styles.billCard, generatingPDF && styles.billCardDisabled]}
      onPress={() => handleDownloadPDF(bill)}
      disabled={generatingPDF}
    >
      <View style={styles.billContent}>
        <View style={styles.billLeft}>
          <Text style={styles.billMonth}>{bill.billingPeriod}</Text>
          <Text style={styles.billAmount}>{billingService.formatCurrency(bill.totalAmount)}</Text>
          <Text style={styles.billStatus}>{bill.status}</Text>
        </View>
        <View style={styles.billRight}>
          <View style={[
            styles.downloadIcon,
            bill.status === 'Paid' ? styles.downloadIconPaid : styles.downloadIconPending,
            generatingPDF && styles.downloadIconDisabled
          ]}>
            {generatingPDF ? (
              <Text style={styles.loadingText}>...</Text>
            ) : (
              <Image 
                source={require('../assets/icons/ic_download.png')}
                style={[
                  styles.downloadIconImage,
                  bill.status === 'Paid' ? styles.downloadIconImagePaid : styles.downloadIconImagePending
                ]}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.checkIconText}>✓</Text>
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
            <Text style={styles.rentDueText}>Current Balance:</Text>
            <Text style={styles.rentAmount}>{billingService.formatCurrency(currentBalance)}</Text>
          </View>
          <View style={styles.summaryBottomRight}>
            <Text style={styles.dueDate}>{bills.length} bills</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activePaymentTab === 'bills' && styles.activeTab
          ]}
          onPress={() => setActivePaymentTab('bills')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            activePaymentTab === 'bills' && styles.activeTabText
          ]}>
            Bills
          </Text>
          {activePaymentTab === 'bills' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activePaymentTab === 'payments' && styles.activeTab
          ]}
          onPress={() => setActivePaymentTab('payments')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            activePaymentTab === 'payments' && styles.activeTabText
          ]}>
            Payments
          </Text>
          {activePaymentTab === 'payments' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activePaymentTab === 'bills' ? (
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.billsContainer}>
              {bills.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No bills found</Text>
                  <Text style={styles.emptySubtext}>Your bills will appear here once generated by your landlord</Text>
                </View>
              ) : (
                bills.map((bill, index) => (
                  <BillCard key={bill.id || index} bill={bill} />
                ))
              )}
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.paymentsContainer}>
              <Text style={styles.yearText}>Payment History</Text>
              {bills.filter(bill => bill.status === 'Paid').length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No payment history</Text>
                  <Text style={styles.emptySubtext}>Your payment history will appear here</Text>
                </View>
              ) : (
                bills
                  .filter(bill => bill.status === 'Paid')
                  .map((bill, index) => (
                    <PaymentItem 
                      key={bill.id || index} 
                      payment={{
                        amount: billingService.formatCurrency(bill.totalAmount),
                        date: billingService.formatDate(bill.paymentDate || bill.createdAt),
                        status: 'completed'
                      }} 
                    />
                  ))
              )}
            </View>
          </ScrollView>
        )}
      </View>

      <BotNav activeTab="payment" onTabPress={handleTabPress} />

      {/* Bill Breakdown Modal */}
      <BillBreakdownModal
        visible={isBillBreakdownVisible}
        onClose={() => setIsBillBreakdownVisible(false)}
        tenantId={currentUser?.uid}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        visible={isReceiptModalVisible}
        onClose={() => setIsReceiptModalVisible(false)}
        receiptText={receiptText}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#293241', // Updated header color
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
    backgroundColor: '#293241',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 0,
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
    color: '#293241',
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
    backgroundColor: '#293241',
    marginTop: 10,
    marginBottom: 0,
    marginHorizontal: 20,
    borderRadius: 12,
    borderColor: '#293241',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeTab: {
    // No background color needed for active tab
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -3,
    left: 30,
    right: 30,
    height: 3,
    backgroundColor: '#FFFFFF', // White underline
    borderRadius: 1.5,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  billsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  billCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    color: '#293241',
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
  downloadIconImage: {
    width: 16,
    height: 16,
  },
  downloadIconImagePaid: {
    tintColor: '#fff',
  },
  downloadIconImagePending: {
    tintColor: '#6b7280',
  },
  paymentsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  yearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#293241',
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
    color: '#293241',
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
  checkIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  billStatus: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  billCardDisabled: {
    opacity: 0.6,
  },
  downloadIconDisabled: {
    backgroundColor: '#e5e7eb',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
});

export default TenantPayment;
