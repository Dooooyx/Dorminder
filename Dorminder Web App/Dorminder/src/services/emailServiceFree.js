import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_7f292zn';
const EMAILJS_PUBLIC_KEY = 'RvdVqsFtIK43bOka0';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const emailServiceFree = {
  // Notify landlord about new request
  async notifyLandlordNewRequest(requestData) {
    try {
      const { landlordEmail, tenantName, requestTitle, requestDescription, propertyName } = requestData;
      
      console.log('📧 Sending landlord notification email...');
      console.log('📧 EmailJS Service ID:', EMAILJS_SERVICE_ID);
      console.log('📧 Template Parameters:', {
        landlord_email: landlordEmail,
        tenant_name: tenantName,
        request_title: requestTitle,
        request_description: requestDescription,
        property_name: propertyName
      });

      const templateParams = {
        landlord_email: landlordEmail,
        tenant_name: tenantName,
        request_title: requestTitle,
        request_description: requestDescription,
        property_name: propertyName
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'landlord_request_notification', // Template ID for landlord notifications
        templateParams
      );

      console.log('✅ Landlord notification email sent successfully:', response);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('❌ EmailJS error sending landlord notification:', error);
      console.log('📧 Landlord Notification Email Data (for manual sending):', {
        landlord_email: requestData.landlordEmail,
        tenant_name: requestData.tenantName,
        request_title: requestData.requestTitle,
        request_description: requestData.requestDescription,
        property_name: requestData.propertyName
      });
      throw error;
    }
  }
};
