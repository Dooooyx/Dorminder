import emailjs from '@emailjs/browser';

// EmailJS Configuration
// Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_7f292zn'; // Your actual service ID
const EMAILJS_PUBLIC_KEY = 'RvdVqsFtIK43bOka0'; // Replace with your public key from EmailJS dashboard

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const emailServiceFree = {
  // Send tenant credentials email using EmailJS
  async sendTenantCredentials(tenantData) {
    try {
      const templateParams = {
        to_email: tenantData.tenantEmail,
        tenant_name: tenantData.tenantName,
        password: tenantData.password,
        landlord_name: tenantData.landlordName,
        property_name: tenantData.propertyName,
        first_name: tenantData.firstName,
        last_name: tenantData.lastName,
        middle_initial: tenantData.middleInitial,
        contact_number: tenantData.contactNumber,
        email_address: tenantData.emailAddress,
        emergency_contact_name: tenantData.emergencyContactName,
        emergency_contact_number: tenantData.emergencyContactNumber,
        account_email: tenantData.accountEmail,
        room_number: tenantData.roomNumber,
        rent_amount: tenantData.rentAmount,
        initial_payment_status: tenantData.initialPaymentStatus,
        lease_start_date: tenantData.leaseStartDate,
        lease_end_date: tenantData.leaseEndDate,
        status: tenantData.status
      };

      console.log('📧 Sending tenant credentials email to:', tenantData.tenantEmail);
      console.log('📧 Using Service ID:', EMAILJS_SERVICE_ID);
      console.log('📧 Template params:', templateParams);

      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'tenant_credentials', // Your actual template ID
        templateParams
      );

      console.log('✅ Tenant credentials email sent successfully:', result);
      return { success: true, message: 'Tenant credentials email sent successfully' };
    } catch (error) {
      console.error('❌ EmailJS error sending tenant credentials:', error);
      // Fallback: log the data for manual sending
      console.log('📧 Tenant Credentials Email Data (for manual sending):', {
        to: tenantData.tenantEmail,
        subject: 'Welcome to Dorminder - Your Account & Registration Details',
        tenantName: tenantData.tenantName,
        password: tenantData.password,
        landlordName: tenantData.landlordName,
        propertyName: tenantData.propertyName,
        firstName: tenantData.firstName,
        lastName: tenantData.lastName,
        middleInitial: tenantData.middleInitial,
        contactNumber: tenantData.contactNumber,
        emailAddress: tenantData.emailAddress,
        emergencyContactName: tenantData.emergencyContactName,
        emergencyContactNumber: tenantData.emergencyContactNumber,
        accountEmail: tenantData.accountEmail,
        roomNumber: tenantData.roomNumber,
        rentAmount: tenantData.rentAmount,
        initialPaymentStatus: tenantData.initialPaymentStatus,
        leaseStartDate: tenantData.leaseStartDate,
        leaseEndDate: tenantData.leaseEndDate,
        status: tenantData.status
      });
      throw error;
    }
  },

  // Landlord notification removed - only sending emails to tenants
};

// Setup Instructions:
/*
1. Sign up at https://www.emailjs.com/ (free tier available)
2. Create email templates with IDs:
   - 'tenant_credentials' (for tenant welcome email)
   - 'landlord_notification' (for landlord notification email)
3. Get your Service ID and Public Key from EmailJS dashboard
4. Replace 'YOUR_SERVICE_ID' and 'YOUR_PUBLIC_KEY' above
5. Install EmailJS: npm install @emailjs/browser (already done)
6. Test by registering a new tenant

The system will:
- Try to send emails via EmailJS
- If EmailJS fails, log the data to console for manual sending
- Continue with tenant registration even if emails fail
*/
    