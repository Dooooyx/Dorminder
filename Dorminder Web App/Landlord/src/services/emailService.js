import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// Callable functions
const sendTenantCredentials = httpsCallable(functions, 'sendTenantCredentials');
const sendTenantRegistrationNotification = httpsCallable(functions, 'sendTenantRegistrationNotification');
const notifyLandlordNewRequest = httpsCallable(functions, 'notifyLandlordNewRequest');

export const emailService = {
  // Send tenant credentials when landlord adds a tenant
  async sendTenantCredentials(tenantData) {
    try {
      const result = await sendTenantCredentials(tenantData);
      return result.data;
    } catch (error) {
      console.error('Error sending tenant credentials:', error);
      throw error;
    }
  },

  // Send tenant registration notification to landlord
  async sendTenantRegistrationNotification(tenantData) {
    try {
      const result = await sendTenantRegistrationNotification(tenantData);
      return result.data;
    } catch (error) {
      console.error('Error sending landlord notification:', error);
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
