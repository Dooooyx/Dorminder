import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// Callable functions
const sendTenantCredentials = httpsCallable(functions, 'sendTenantCredentials');
const notifyLandlordNewRequest = httpsCallable(functions, 'notifyLandlordNewRequest');

export const emailService = {
  // Send tenant credentials when landlord adds a tenant
  async sendTenantCredentials(tenantData) {
    try {
      const { 
        email, 
        firstName, 
        lastName, 
        password, 
        landlordName, 
        propertyName,
        middleInitial,
        contactNumber,
        emergencyContactName,
        emergencyContactNumber,
        roomNumber,
        monthlyRent,
        leaseStartDate,
        leaseEndDate
      } = tenantData;
      
      const result = await sendTenantCredentials({
        tenantEmail: email,
        tenantName: `${firstName} ${lastName}`,
        password: password,
        landlordName: landlordName,
        propertyName: propertyName,
        // Tenant Information
        firstName: firstName,
        lastName: lastName,
        middleInitial: middleInitial || '',
        contactNumber: contactNumber,
        emailAddress: email,
        emergencyContactName: emergencyContactName,
        emergencyContactNumber: emergencyContactNumber,
        // Account Information
        accountEmail: email,
        // Lease Details
        roomNumber: roomNumber,
        rentAmount: `₱${monthlyRent?.toLocaleString() || '0'}`,
        initialPaymentStatus: 'Pending',
        leaseStartDate: leaseStartDate,
        leaseEndDate: leaseEndDate,
        status: 'Active'
      });

      return result.data;
    } catch (error) {
      console.error('Error sending tenant credentials:', error);
      throw error;
    }
  },

  // Notify landlord about new request
  async notifyLandlordNewRequest(requestData) {
    try {
      const { landlordEmail, tenantName, requestTitle, requestDescription, propertyName } = requestData;
      
      const result = await notifyLandlordNewRequest({
        landlordEmail: landlordEmail,
        tenantName: tenantName,
        requestTitle: requestTitle,
        requestDescription: requestDescription,
        propertyName: propertyName
      });

      return result.data;
    } catch (error) {
      console.error('Error notifying landlord:', error);
      throw error;
    }
  }
};
