import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export class RentService {
  
  // Create rent record for tenant
  async createRentRecord(tenantId, rentData) {
    try {
      const rentRecord = {
        tenantId,
        monthlyRent: rentData.monthlyRent,
        dueDate: rentData.dueDate,
        status: 'pending', // pending, paid, overdue
        balance: rentData.monthlyRent,
        paidAmount: 0,
        lastPaymentDate: null,
        lastPaymentAmount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'rentRecords'), rentRecord);
      return { success: true, rentId: docRef.id };
    } catch (error) {
      console.error('Error creating rent record:', error);
      return { success: false, error: error.message };
    }
  }

  // Record payment
  async recordPayment(rentId, paymentData) {
    try {
      const rentRef = doc(db, 'rentRecords', rentId);
      const rentDoc = await getDoc(rentRef);
      
      if (!rentDoc.exists()) {
        return { success: false, error: 'Rent record not found' };
      }

      const currentRent = rentDoc.data();
      const newPaidAmount = currentRent.paidAmount + paymentData.amount;
      const newBalance = currentRent.monthlyRent - newPaidAmount;
      const newStatus = newBalance <= 0 ? 'paid' : 'pending';

      await updateDoc(rentRef, {
        paidAmount: newPaidAmount,
        balance: newBalance,
        status: newStatus,
        lastPaymentDate: serverTimestamp(),
        lastPaymentAmount: paymentData.amount,
        updatedAt: serverTimestamp()
      });

      // Create payment record
      await this.createPaymentRecord(rentId, paymentData);

      return { success: true };
    } catch (error) {
      console.error('Error recording payment:', error);
      return { success: false, error: error.message };
    }
  }

  // Create payment record
  async createPaymentRecord(rentId, paymentData) {
    try {
      const paymentRecord = {
        rentId,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod || 'cash',
        paymentDate: serverTimestamp(),
        notes: paymentData.notes || '',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'payments'), paymentRecord);
      return { success: true, paymentId: docRef.id };
    } catch (error) {
      console.error('Error creating payment record:', error);
      return { success: false, error: error.message };
    }
  }

  // Get rent status for tenant
  async getRentStatus(tenantId) {
    try {
      const q = query(
        collection(db, 'rentRecords'),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const rentDoc = querySnapshot.docs[0];
        const rentData = { id: rentDoc.id, ...rentDoc.data() };
        
        // Get payment history
        const paymentHistory = await this.getPaymentHistory(rentDoc.id);
        
        return { 
          success: true, 
          data: {
            ...rentData,
            paymentHistory: paymentHistory.success ? paymentHistory.data : []
          }
        };
      } else {
        return { success: false, error: 'No rent record found' };
      }
    } catch (error) {
      console.error('Error getting rent status:', error);
      return { success: false, error: error.message };
    }
  }

  // Get payment history
  async getPaymentHistory(rentId) {
    try {
      const q = query(
        collection(db, 'payments'),
        where('rentId', '==', rentId),
        orderBy('paymentDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const payments = [];
      
      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: payments };
    } catch (error) {
      console.error('Error getting payment history:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all rent records for property
  async getRentRecordsByProperty(propertyId) {
    try {
      // First get all tenants for the property
      const tenantsQuery = query(
        collection(db, 'tenants'),
        where('propertyId', '==', propertyId)
      );
      const tenantsSnapshot = await getDocs(tenantsQuery);
      const tenantIds = tenantsSnapshot.docs.map(doc => doc.id);

      if (tenantIds.length === 0) {
        return { success: true, data: [] };
      }

      // Get rent records for all tenants
      const rentQuery = query(
        collection(db, 'rentRecords'),
        where('tenantId', 'in', tenantIds),
        orderBy('createdAt', 'desc')
      );
      const rentSnapshot = await getDocs(rentQuery);
      const rentRecords = [];
      
      rentSnapshot.forEach((doc) => {
        rentRecords.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: rentRecords };
    } catch (error) {
      console.error('Error getting rent records by property:', error);
      return { success: false, error: error.message };
    }
  }

  // Update rent status (for overdue checks)
  async updateRentStatus(rentId, status) {
    try {
      const rentRef = doc(db, 'rentRecords', rentId);
      await updateDoc(rentRef, {
        status,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating rent status:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate rent statement
  async generateRentStatement(tenantId, month, year) {
    try {
      const rentStatus = await this.getRentStatus(tenantId);
      if (!rentStatus.success) {
        return { success: false, error: 'No rent record found' };
      }

      const rentData = rentStatus.data;
      const statement = {
        tenantId,
        month,
        year,
        monthlyRent: rentData.monthlyRent,
        dueDate: rentData.dueDate,
        balance: rentData.balance,
        paidAmount: rentData.paidAmount,
        status: rentData.status,
        lastPaymentDate: rentData.lastPaymentDate,
        lastPaymentAmount: rentData.lastPaymentAmount,
        paymentHistory: rentData.paymentHistory,
        generatedAt: serverTimestamp()
      };

      return { success: true, data: statement };
    } catch (error) {
      console.error('Error generating rent statement:', error);
      return { success: false, error: error.message };
    }
  }
}

export const rentService = new RentService();












