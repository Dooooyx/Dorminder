import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  getDoc 
} from 'firebase/firestore';
import { db } from './firebase';

export class BillingService {
  
  // Create a new bill
  async createBill(billData) {
    try {
      console.log('💾 Creating bill with data:', {
        tenantId: billData.tenantId,
        tenantName: billData.tenantName,
        totalAmount: billData.totalAmount,
        billingPeriod: billData.billingPeriod
      });
      
      const billRef = await addDoc(collection(db, 'bills'), {
        ...billData,
        status: 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Update tenant payment status to Pending when new bill is created
      if (billData.tenantId) {
        try {
          const { tenantService } = await import('./tenantService');
          await tenantService.updateTenantPaymentStatus(billData.tenantId, 'Pending');
          console.log(`✅ Updated tenant ${billData.tenantId} payment status to Pending`);
        } catch (tenantError) {
          console.error('Error updating tenant payment status:', tenantError);
          // Don't fail the bill creation if tenant update fails
        }
      }
      
      console.log('✅ Bill created successfully with ID:', billRef.id);
      return { success: true, billId: billRef.id };
    } catch (error) {
      console.error('❌ Error creating bill:', error);
      return { success: false, error: error.message };
    }
  }

  // Get bills by tenant ID
  async getBillsByTenant(tenantId) {
    try {
      const q = query(
        collection(db, 'bills'),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const bills = [];
      
      querySnapshot.forEach((doc) => {
        bills.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: bills };
    } catch (error) {
      console.error('Error getting bills by tenant:', error);
      return { success: false, error: error.message };
    }
  }

  // Get bills by landlord ID
  async getBillsByLandlord(landlordId) {
    try {
      const q = query(
        collection(db, 'bills'),
        where('landlordId', '==', landlordId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const bills = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
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
      
      return { success: true, data: bills };
    } catch (error) {
      console.error('Error getting bills by landlord:', error);
      // Return empty array instead of error to prevent crashes
      return { success: true, data: [] };
    }
  }

  // Update bill status (for payment processing)
  async updateBillStatus(billId, status, paymentAmount = null, paymentDate = null) {
    try {
      const billRef = doc(db, 'bills', billId);
      
      // Get the current bill data to access tenantId
      const billDoc = await getDoc(billRef);
      if (!billDoc.exists()) {
        return { success: false, error: 'Bill not found' };
      }
      
      const billData = billDoc.data();
      const updateData = {
        status,
        updatedAt: serverTimestamp()
      };

      if (paymentAmount !== null) {
        updateData.paymentAmount = paymentAmount;
        updateData.paymentDate = paymentDate || serverTimestamp();
        updateData.remainingBalance = Math.max(0, (billData.totalAmount || 0) - paymentAmount);
      }

      await updateDoc(billRef, updateData);
      
      // Sync tenant payment status based on all bills
      if (billData.tenantId) {
        try {
          await this.syncTenantPaymentStatus(billData.tenantId);
        } catch (tenantError) {
          console.error('Error syncing tenant payment status:', tenantError);
          // Don't fail the bill update if tenant update fails
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating bill status:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current balance for tenant
  async getTenantCurrentBalance(tenantId) {
    try {
      const q = query(
        collection(db, 'bills'),
        where('tenantId', '==', tenantId),
        where('status', 'in', ['Pending', 'Partially Paid'])
      );
      
      const querySnapshot = await getDocs(q);
      let totalBalance = 0;
      let bills = [];
      
      querySnapshot.forEach((doc) => {
        const bill = { id: doc.id, ...doc.data() };
        bills.push(bill);
        totalBalance += bill.remainingBalance || bill.totalAmount;
      });
      
      return { success: true, data: { totalBalance, bills } };
    } catch (error) {
      console.error('Error getting tenant current balance:', error);
      return { success: false, error: error.message };
    }
  }

  // Process payment (landlord input)
  async processPayment(billId, paymentAmount, paymentDate = null) {
    try {
      const billRef = doc(db, 'bills', billId);
      const billDoc = await getDoc(billRef);
      
      if (!billDoc.exists()) {
        return { success: false, error: 'Bill not found' };
      }
      
      const billData = billDoc.data();
      const totalAmount = billData.totalAmount;
      const currentPaymentAmount = billData.paymentAmount || 0;
      const newTotalPayment = currentPaymentAmount + paymentAmount;
      
      let newStatus;
      let remainingBalance;
      
      if (newTotalPayment >= totalAmount) {
        newStatus = 'Paid';
        remainingBalance = 0;
      } else {
        newStatus = 'Partially Paid';
        remainingBalance = totalAmount - newTotalPayment;
      }
      
      await updateDoc(billRef, {
        status: newStatus,
        paymentAmount: newTotalPayment,
        paymentDate: paymentDate || serverTimestamp(),
        remainingBalance,
        updatedAt: serverTimestamp()
      });
      
      // Sync tenant payment status based on all bills
      if (billData.tenantId) {
        try {
          await this.syncTenantPaymentStatus(billData.tenantId);
        } catch (syncError) {
          console.error('Error syncing tenant payment status:', syncError);
          // Don't fail the payment if sync fails
        }
      }
      
      return { 
        success: true, 
        data: { 
          status: newStatus, 
          remainingBalance,
          totalPaid: newTotalPayment
        } 
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      return { success: false, error: error.message };
    }
  }

  // Sync tenant payment status based on all bills
  async syncTenantPaymentStatus(tenantId) {
    try {
      // Get all bills for this tenant
      const billsQuery = query(
        collection(db, 'bills'),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );
      const billsSnapshot = await getDocs(billsQuery);
      
      if (billsSnapshot.empty) {
        // No bills found, set to Paid (no outstanding bills)
        const { tenantService } = await import('./tenantService');
        await tenantService.updateTenantPaymentStatus(tenantId, 'Paid');
        return;
      }
      
      // Check if all bills are paid
      let hasPendingBills = false;
      billsSnapshot.forEach((doc) => {
        const bill = doc.data();
        if (bill.status !== 'Paid' && bill.status !== 'paid') {
          hasPendingBills = true;
        }
      });
      
      // Update tenant payment status
      const { tenantService } = await import('./tenantService');
      const newPaymentStatus = hasPendingBills ? 'Pending' : 'Paid';
      await tenantService.updateTenantPaymentStatus(tenantId, newPaymentStatus);
      console.log(`✅ Synced tenant ${tenantId} payment status to ${newPaymentStatus}`);
    } catch (error) {
      console.error('Error syncing tenant payment status:', error);
      throw error;
    }
  }

  // Generate monthly rent bill (for automatic generation)
  async generateMonthlyRentBill(tenantId, landlordId, roomNumber, monthlyRent, billingPeriod) {
    try {
      const billData = {
        tenantId,
        landlordId,
        roomNumber,
        billingPeriod,
        billType: 'Monthly Rent',
        totalAmount: monthlyRent,
        remainingBalance: monthlyRent,
        dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), // 1st of next month
        description: `Monthly rent for ${billingPeriod}`,
        items: [
          {
            description: 'Room Rental',
            amount: monthlyRent,
            type: 'rent'
          }
        ]
      };
      
      return await this.createBill(billData);
    } catch (error) {
      console.error('Error generating monthly rent bill:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete bill
  async deleteBill(billId) {
    try {
      // Get bill data before deleting to sync tenant status
      const billRef = doc(db, 'bills', billId);
      const billDoc = await getDoc(billRef);
      
      if (!billDoc.exists()) {
        return { success: false, error: 'Bill not found' };
      }
      
      const billData = billDoc.data();
      const tenantId = billData.tenantId;
      
      // Delete the bill
      await deleteDoc(billRef);
      
      // Sync tenant payment status after deletion
      if (tenantId) {
        try {
          await this.syncTenantPaymentStatus(tenantId);
        } catch (syncError) {
          console.error('Error syncing tenant payment status after deletion:', syncError);
          // Don't fail the deletion if sync fails
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting bill:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate monthly rent bills for all tenants (for rent reset system)
  async generateMonthlyRentBillsForAllTenants(landlordId) {
    try {
      // Import tenant service dynamically to avoid circular dependency
      const { tenantService } = await import('./tenantService');
      
      // Get all tenants for this landlord
      const tenantsResult = await tenantService.getTenantsByProperty(landlordId);
      
      if (!tenantsResult.success) {
        return { success: false, error: 'Failed to fetch tenants' };
      }

      const tenants = tenantsResult.data;
      const results = [];
      const currentDate = new Date();
      const billingPeriod = currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });

      // Generate bills for each tenant
      for (const tenant of tenants) {
        if (tenant.isActive && tenant.monthlyRent > 0) {
          const billData = {
            tenantId: tenant.userId, // Use userId (Firebase Auth UID) instead of document ID
            tenantName: `${tenant.firstName} ${tenant.lastName}`,
            landlordId: landlordId,
            roomNumber: tenant.roomNumber,
            billingPeriod: billingPeriod,
            billType: 'Monthly Rent',
            totalAmount: tenant.monthlyRent,
            remainingBalance: tenant.monthlyRent,
            dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1), // 1st of next month
            description: `Monthly rent for ${billingPeriod}`,
            items: [
              {
                description: 'Room Rental',
                amount: tenant.monthlyRent,
                type: 'rent'
              }
            ]
          };

          const result = await this.createBill(billData);
          results.push({
            tenantId: tenant.userId, // Use userId for consistency
            tenantName: `${tenant.firstName} ${tenant.lastName}`,
            success: result.success,
            billId: result.billId,
            error: result.error
          });
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return { 
        success: true, 
        data: { 
          total: tenants.length,
          successful,
          failed,
          results
        } 
      };
    } catch (error) {
      console.error('Error generating monthly rent bills:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if monthly rent bills already exist for current month
  async checkMonthlyRentBillsExist(landlordId, billingPeriod) {
    try {
      const q = query(
        collection(db, 'bills'),
        where('landlordId', '==', landlordId),
        where('billType', '==', 'Monthly Rent'),
        where('billingPeriod', '==', billingPeriod)
      );
      
      const querySnapshot = await getDocs(q);
      return { 
        success: true, 
        data: { 
          exists: !querySnapshot.empty,
          count: querySnapshot.size 
        } 
      };
    } catch (error) {
      console.error('Error checking monthly rent bills:', error);
      return { success: false, error: error.message };
    }
  }
}

export const billingService = new BillingService();
