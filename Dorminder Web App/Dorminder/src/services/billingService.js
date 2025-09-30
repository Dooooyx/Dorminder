import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

export class BillingService {
  
  // Get bills by tenant ID
  async getBillsByTenant(tenantId) {
    try {
      console.log('🔍 Searching for bills with tenantId:', tenantId);
      
      const q = query(
        collection(db, 'bills'),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const bills = [];
      
      console.log('📊 Query returned', querySnapshot.size, 'documents');
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📄 Bill found:', {
          id: doc.id,
          tenantId: data.tenantId,
          tenantName: data.tenantName,
          totalAmount: data.totalAmount,
          status: data.status
        });
        
        bills.push({
          id: doc.id,
          ...data,
          // Ensure all required fields have default values
          totalAmount: data.totalAmount || 0,
          remainingBalance: data.remainingBalance || data.totalAmount || 0,
          status: data.status || 'Pending',
          roomNumber: data.roomNumber || 'N/A',
          tenantName: data.tenantName || 'N/A',
          billingPeriod: data.billingPeriod || 'N/A'
        });
      });
      
      console.log('✅ Returning', bills.length, 'bills for tenant:', tenantId);
      return { success: true, data: bills };
    } catch (error) {
      console.error('❌ Error getting bills by tenant:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current balance for tenant
  async getTenantCurrentBalance(tenantId) {
    try {
      console.log('💰 Getting current balance for tenantId:', tenantId);
      
      const q = query(
        collection(db, 'bills'),
        where('tenantId', '==', tenantId),
        where('status', 'in', ['Pending', 'Partially Paid'])
      );
      
      const querySnapshot = await getDocs(q);
      let totalBalance = 0;
      let bills = [];
      
      console.log('📊 Balance query returned', querySnapshot.size, 'documents');
      
      querySnapshot.forEach((doc) => {
        const bill = { id: doc.id, ...doc.data() };
        console.log('💳 Bill for balance:', {
          id: doc.id,
          tenantId: bill.tenantId,
          status: bill.status,
          remainingBalance: bill.remainingBalance,
          totalAmount: bill.totalAmount
        });
        
        bills.push(bill);
        totalBalance += bill.remainingBalance || bill.totalAmount;
      });
      
      console.log('💰 Total balance calculated:', totalBalance, 'from', bills.length, 'bills');
      return { success: true, data: { totalBalance, bills } };
    } catch (error) {
      console.error('❌ Error getting tenant current balance:', error);
      return { success: false, error: error.message };
    }
  }

  // Get bill breakdown for tenant
  async getBillBreakdown(tenantId) {
    try {
      const q = query(
        collection(db, 'bills'),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const bills = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bills.push({
          id: doc.id,
          ...data,
          totalAmount: data.totalAmount || 0,
          remainingBalance: data.remainingBalance || data.totalAmount || 0,
          status: data.status || 'Pending',
          roomNumber: data.roomNumber || 'N/A',
          tenantName: data.tenantName || 'N/A',
          billingPeriod: data.billingPeriod || 'N/A',
          items: data.items || []
        });
      });
      
      return { success: true, data: bills };
    } catch (error) {
      console.error('Error getting bill breakdown:', error);
      return { success: false, error: error.message };
    }
  }

  // Format currency for display
  formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '₱0';
    }
    return `₱${amount.toLocaleString()}`;
  }

  // Format date for display
  formatDate(date) {
    if (!date) return 'N/A';
    
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  }
}

export const billingService = new BillingService();
