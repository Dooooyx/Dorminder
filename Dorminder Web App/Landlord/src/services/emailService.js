import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_dorminder'; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID_CREDENTIALS = 'template_tenant_credentials'; // Replace with your template ID
const EMAILJS_TEMPLATE_ID_DETAILS = 'template_tenant_details'; // Replace with your template ID
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // Replace with your EmailJS public key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const emailService = {
  // Send tenant credentials when landlord adds a tenant
  async sendTenantCredentials(tenantData) {
    try {
      console.log('📧 Sending tenant credentials via EmailJS to:', tenantData.tenantEmail);

      const templateParams = {
        to_email: tenantData.tenantEmail,
        tenant_name: tenantData.tenantName,
        password: tenantData.password,
        first_name: tenantData.firstName,
        last_name: tenantData.lastName,
        middle_name: tenantData.middleName || '',
        contact_number: tenantData.contactNumber,
        emergency_contact: tenantData.emergencyContact,
        emergency_contact_number: tenantData.emergencyContactNumber,
        room_number: tenantData.roomNumber,
        monthly_rent: tenantData.monthlyRent,
        lease_start_date: tenantData.leaseStartDate,
        lease_end_date: tenantData.leaseEndDate,
        security_deposit: tenantData.securityDeposit,
        property_name: tenantData.propertyName || 'Dorminder Property',
        status: tenantData.status || 'Active'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_CREDENTIALS,
        templateParams
      );

      console.log('✅ Tenant credentials email sent successfully via EmailJS:', response);
      return { success: true, message: 'Credentials sent successfully' };
    } catch (error) {
      console.error('❌ Error sending tenant credentials via EmailJS:', error);
      throw error;
    }
  },

  // Send tenant registration details (without password)
  async sendTenantRegistrationDetails(tenantData) {
    try {
      console.log('📧 Sending tenant registration details via EmailJS to:', tenantData.tenantEmail);

      const templateParams = {
        to_email: tenantData.tenantEmail,
        tenant_name: tenantData.tenantName,
        landlord_name: tenantData.landlordName || 'Landlord',
        property_name: tenantData.propertyName || 'Dorminder Property',
        // Tenant Information
        first_name: tenantData.firstName,
        last_name: tenantData.lastName,
        middle_initial: tenantData.middleInitial || '',
        contact_number: tenantData.contactNumber,
        email_address: tenantData.emailAddress,
        emergency_contact_name: tenantData.emergencyContactName,
        emergency_contact_number: tenantData.emergencyContactNumber,
        // Account Information (excluding password)
        account_email: tenantData.accountEmail,
        // Lease Details
        room_number: tenantData.roomNumber,
        rent_amount: tenantData.rentAmount,
        initial_payment_status: tenantData.initialPaymentStatus || 'Pending',
        lease_start_date: tenantData.leaseStartDate,
        lease_end_date: tenantData.leaseEndDate,
        security_deposit: tenantData.securityDeposit,
        status: tenantData.status || 'Active',
        // Documents (if available)
        valid_id_url: tenantData.validIdUrl || 'Not provided',
        lease_contract_url: tenantData.leaseContractUrl || 'Not provided'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_DETAILS,
        templateParams
      );

      console.log('✅ Tenant registration details email sent successfully via EmailJS:', response);
      return { success: true, message: 'Registration details sent successfully' };
    } catch (error) {
      console.error('❌ Error sending tenant registration details via EmailJS:', error);
      throw error;
    }
  },

  // Send tenant registration notification to landlord
  async sendTenantRegistrationNotification(tenantData) {
    try {
      console.log('📧 Sending landlord notification via EmailJS to:', tenantData.landlordEmail);

      const templateParams = {
        to_email: tenantData.landlordEmail,
        landlord_name: tenantData.landlordName || 'Landlord',
        tenant_name: tenantData.tenantName,
        property_name: tenantData.propertyName || 'Dorminder Property',
        registration_date: new Date().toLocaleDateString(),
        tenant_email: tenantData.tenantEmail,
        room_number: tenantData.roomNumber,
        monthly_rent: tenantData.monthlyRent
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'template_landlord_notification', // You'll need to create this template
        templateParams
      );

      console.log('✅ Landlord notification sent successfully via EmailJS:', response);
      return { success: true, message: 'Landlord notification sent successfully' };
    } catch (error) {
      console.error('❌ Error sending landlord notification via EmailJS:', error);
      throw error;
    }
  },

  // Notify landlord about new request
  async notifyLandlordNewRequest(requestData) {
    try {
      console.log('📧 Sending request notification via EmailJS to:', requestData.landlordEmail);

      const templateParams = {
        to_email: requestData.landlordEmail,
        landlord_name: 'Landlord',
        tenant_name: requestData.tenantName,
        request_title: requestData.requestTitle,
        request_description: requestData.requestDescription,
        property_name: requestData.propertyName || 'Dorminder Property',
        request_date: new Date().toLocaleDateString()
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'template_request_notification', // You'll need to create this template
        templateParams
      );

      console.log('✅ Request notification sent successfully via EmailJS:', response);
      return { success: true, message: 'Request notification sent successfully' };
    } catch (error) {
      console.error('❌ Error sending request notification via EmailJS:', error);
      throw error;
    }
  }
};