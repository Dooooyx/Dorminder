import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { billingService } from '../services/billingService';

const BillBreakdownModal = ({ visible, onClose, tenantId }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible && tenantId) {
      loadBillBreakdown();
    }
  }, [visible, tenantId]);

  const loadBillBreakdown = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await billingService.getBillBreakdown(tenantId);
      
      if (result.success) {
        setBills(result.data);
      } else {
        setError(result.error || 'Failed to load bill breakdown');
      }
    } catch (error) {
      console.error('Error loading bill breakdown:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return '#61BD45';
      case 'Partially Paid':
        return '#FFA500';
      case 'Overdue':
        return '#EE6C4D';
      default:
        return '#9498A0';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Paid':
        return 'Paid';
      case 'Partially Paid':
        return 'Partially Paid';
      case 'Overdue':
        return 'Overdue';
      default:
        return 'Pending';
    }
  };

  const renderBillItem = (bill) => (
    <View key={bill.id} style={styles.billCard}>
      <View style={styles.billHeader}>
        <View>
          <Text style={styles.billPeriod}>{bill.billingPeriod}</Text>
          <Text style={styles.billType}>{bill.billType || 'Monthly Bill'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bill.status) }]}>
          <Text style={styles.statusText}>{getStatusText(bill.status)}</Text>
        </View>
      </View>

      <View style={styles.billDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Amount:</Text>
          <Text style={styles.detailValue}>{billingService.formatCurrency(bill.totalAmount)}</Text>
        </View>
        
        {bill.status !== 'Paid' && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Remaining Balance:</Text>
            <Text style={[styles.detailValue, { color: '#EE6C4D' }]}>
              {billingService.formatCurrency(bill.remainingBalance)}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Due Date:</Text>
          <Text style={styles.detailValue}>{billingService.formatDate(bill.dueDate)}</Text>
        </View>
      </View>

      {/* Bill Items Breakdown */}
      {bill.items && bill.items.length > 0 && (
        <View style={styles.itemsSection}>
          <Text style={styles.itemsTitle}>Breakdown:</Text>
          {bill.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemAmount}>{billingService.formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>
      )}

      {bill.description && (
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>{bill.description}</Text>
        </View>
      )}
    </View>
  );

  const calculateTotalBalance = () => {
    return bills.reduce((total, bill) => {
      if (bill.status !== 'Paid') {
        return total + (bill.remainingBalance || bill.totalAmount);
      }
      return total;
    }, 0);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bill Breakdown</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text style={styles.loadingText}>Loading bills...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={loadBillBreakdown} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : bills.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Bills Found</Text>
              <Text style={styles.emptyText}>You don't have any bills yet.</Text>
            </View>
          ) : (
            <>
              {/* Summary Card */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Current Balance</Text>
                <Text style={styles.summaryAmount}>
                  {billingService.formatCurrency(calculateTotalBalance())}
                </Text>
                <Text style={styles.summarySubtext}>
                  Total outstanding amount across all bills
                </Text>
              </View>

              {/* Bills List */}
              <View style={styles.billsSection}>
                <Text style={styles.sectionTitle}>All Bills</Text>
                {bills.map(renderBillItem)}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
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
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#EE6C4D',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  billsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  billCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  billPeriod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  billType: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  billDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  itemsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  descriptionSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});

export default BillBreakdownModal;
