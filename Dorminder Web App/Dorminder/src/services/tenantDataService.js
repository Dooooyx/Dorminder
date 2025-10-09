import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

export class TenantDataService {
  
  // Get tenant data by user ID
  async getTenantData(userId) {
    try {
      // Query tenants collection where userId matches
      const tenantsRef = collection(db, 'tenants');
      const q = query(tenantsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { success: false, error: 'Tenant not found' };
      }
      
      // Get the first (and should be only) tenant document
      const tenantDoc = querySnapshot.docs[0];
      const tenantData = tenantDoc.data();
      
      return { 
        success: true, 
        data: {
          id: tenantDoc.id,
          ...tenantData
        }
      };
    } catch (error) {
      console.error('Error getting tenant data:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get tenant's room information
  async getTenantRoom(roomId) {
    try {
      if (!roomId) {
        return { success: false, error: 'No room assigned' };
      }
      
      const roomDoc = await getDoc(doc(db, 'rooms', roomId));
      
      if (!roomDoc.exists()) {
        return { success: false, error: 'Room not found' };
      }
      
      return { 
        success: true, 
        data: {
          id: roomDoc.id,
          ...roomDoc.data()
        }
      };
    } catch (error) {
      console.error('Error getting room data:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get tenant's rent status and payment history
  async getTenantRentStatus(tenantId, tenantData) {
    try {
      let payments = [];
      let totalPaid = 0;
      
      try {
        // Query payments collection for this tenant
        const paymentsRef = collection(db, 'payments');
        const q = query(
          paymentsRef, 
          where('tenantId', '==', tenantId),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          payments.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Calculate total paid amount
        totalPaid = payments.reduce((sum, payment) => {
          return sum + (payment.amount || 0);
        }, 0);
      } catch (paymentError) {
        console.log('No payments found or index still building, using fallback:', paymentError.message);
        // Continue with empty payments array - this is normal for new tenants
      }
      
      // Calculate current balance based on months since room assignment
      const currentBalance = this.calculateCurrentBalance(tenantData, totalPaid);
      
      // Get detailed balance information
      const balanceDetails = this.getBalanceDetails(tenantData, totalPaid);
      
      return { 
        success: true, 
        data: {
          payments,
          totalPaid,
          currentBalance,
          balanceDetails,
          lastPayment: payments[0] || null
        }
      };
    } catch (error) {
      console.error('Error getting rent status:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Calculate current balance based on months since room assignment
  calculateCurrentBalance(tenantData, totalPaid) {
    try {
      const monthlyRent = tenantData.monthlyRent || 0;
      const leaseStartDate = tenantData.leaseStartDate;
      
      console.log('Balance calculation debug:', {
        monthlyRent,
        leaseStartDate,
        totalPaid,
        tenantData: tenantData
      });
      
      if (!leaseStartDate || monthlyRent === 0) {
        console.log('Balance calculation: Missing lease start date or monthly rent');
        return 0;
      }
      
      // Convert lease start date to Date object
      let startDate;
      if (leaseStartDate.toDate) {
        startDate = leaseStartDate.toDate();
      } else if (typeof leaseStartDate === 'string') {
        startDate = new Date(leaseStartDate);
      } else {
        startDate = leaseStartDate;
      }
      
      // Calculate months elapsed since lease start
      const currentDate = new Date();
      const monthsElapsed = this.getMonthsDifference(startDate, currentDate);
      
      // Calculate total amount due (months elapsed * monthly rent)
      const totalDue = monthsElapsed * monthlyRent;
      
      // Current balance = total due - total paid
      const currentBalance = Math.max(0, totalDue - totalPaid);
      
      console.log('Balance calculation result:', {
        monthsElapsed,
        totalDue,
        totalPaid,
        currentBalance
      });
      
      return currentBalance;
    } catch (error) {
      console.error('Error calculating current balance:', error);
      return 0;
    }
  }
  
  // Calculate months difference between two dates
  getMonthsDifference(date1, date2) {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();
    const month1 = date1.getMonth();
    const month2 = date2.getMonth();
    
    return (year2 - year1) * 12 + (month2 - month1);
  }
  
  // Get detailed balance information
  getBalanceDetails(tenantData, totalPaid) {
    try {
      const monthlyRent = tenantData.monthlyRent || 0;
      const leaseStartDate = tenantData.leaseStartDate;
      
      if (!leaseStartDate || monthlyRent === 0) {
        return {
          monthsElapsed: 0,
          totalDue: 0,
          totalPaid: 0,
          currentBalance: 0,
          nextDueDate: null
        };
      }
      
      // Convert lease start date to Date object
      let startDate;
      if (leaseStartDate.toDate) {
        startDate = leaseStartDate.toDate();
      } else if (typeof leaseStartDate === 'string') {
        startDate = new Date(leaseStartDate);
      } else {
        startDate = leaseStartDate;
      }
      
      // Calculate months elapsed since lease start
      const currentDate = new Date();
      const monthsElapsed = this.getMonthsDifference(startDate, currentDate);
      
      // Calculate total amount due (months elapsed * monthly rent)
      const totalDue = monthsElapsed * monthlyRent;
      
      // Current balance = total due - total paid
      const currentBalance = Math.max(0, totalDue - totalPaid);
      
      // Calculate next due date (next month from lease start)
      const nextDueDate = new Date(startDate);
      nextDueDate.setMonth(nextDueDate.getMonth() + monthsElapsed + 1);
      
      // Calculate next payment amount (monthly rent)
      const nextPaymentAmount = monthlyRent;
      
      return {
        monthsElapsed,
        totalDue,
        totalPaid,
        currentBalance,
        nextDueDate,
        nextPaymentAmount
      };
    } catch (error) {
      console.error('Error getting balance details:', error);
      return {
        monthsElapsed: 0,
        totalDue: 0,
        totalPaid: 0,
        currentBalance: 0,
        nextDueDate: null
      };
    }
  }
  
  // Get news for tenant's property
  async getNews(propertyId) {
    try {
      console.log('🔍 TenantDataService.getNews called with propertyId:', propertyId);
      
      const newsRef = collection(db, 'announcements'); // Keep collection name as 'announcements' for backend compatibility
      const q = query(
        newsRef, 
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      
      console.log('📋 Executing Firestore query for announcements...');
      const querySnapshot = await getDocs(q);
      console.log('📊 Query snapshot size:', querySnapshot.size);
      
      const newsItems = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📄 Found announcement:', { id: doc.id, title: data.title, propertyId: data.propertyId });
        newsItems.push({
          id: doc.id,
          ...data
        });
      });
      
      console.log('✅ Final news items:', newsItems);
      return { success: true, data: newsItems };
    } catch (error) {
      console.error('❌ Error getting news:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get all announcements (fallback for debugging)
  async getAllAnnouncements() {
    try {
      console.log('🔍 TenantDataService.getAllAnnouncements called (fallback)');
      
      const newsRef = collection(db, 'announcements');
      const q = query(
        newsRef, 
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      
      console.log('📋 Executing fallback Firestore query for all announcements...');
      const querySnapshot = await getDocs(q);
      console.log('📊 Fallback query snapshot size:', querySnapshot.size);
      
      const newsItems = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📄 Fallback found announcement:', { id: doc.id, title: data.title, propertyId: data.propertyId });
        newsItems.push({
          id: doc.id,
          ...data
        });
      });
      
      console.log('✅ Fallback final news items:', newsItems);
      return { success: true, data: newsItems };
    } catch (error) {
      console.error('❌ Error getting all announcements:', error);
      return { success: false, error: error.message };
    }
  }

  // Get complete tenant dashboard data
  async getTenantDashboardData(userId) {
    try {
      // Get tenant data
      const tenantResult = await this.getTenantData(userId);
      if (!tenantResult.success) {
        return tenantResult;
      }
      
      const tenant = tenantResult.data;
      
      // Get room data if tenant has a room
      let roomData = null;
      if (tenant.roomId) {
        const roomResult = await this.getTenantRoom(tenant.roomId);
        if (roomResult.success) {
          roomData = roomResult.data;
        }
      }
      
      // Get rent status (pass tenant data for balance calculation)
      const rentResult = await this.getTenantRentStatus(tenant.id, tenant);
      const rentData = rentResult.success ? rentResult.data : null;
      
      // Get news
      const newsResult = await this.getNews(tenant.propertyId);
      const newsItems = newsResult.success ? newsResult.data : [];
      
      return {
        success: true,
        data: {
          tenant,
          room: roomData,
          rent: rentData,
          newsItems
        }
      };
    } catch (error) {
      console.error('Error getting tenant dashboard data:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Format date for display
  formatDate(date) {
    if (!date) return 'N/A';
    
    try {
      // Handle Firestore timestamp
      if (date.toDate) {
        date = date.toDate();
      }
      
      // Handle string dates
      if (typeof date === 'string') {
        date = new Date(date);
      }
      
      // Format as "Dec 2025"
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  }
  
  // Format currency for display
  formatCurrency(amount) {
    if (!amount) return '₱ 0';
    return `₱ ${amount.toLocaleString()}`;
  }
}

export const tenantDataService = new TenantDataService();
