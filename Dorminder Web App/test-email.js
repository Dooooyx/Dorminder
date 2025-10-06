const nodemailer = require('nodemailer');

// Test email credentials
async function testEmail() {
  // Replace these with your actual credentials
  const testCredentials = {
    user: 'arsu.pantinople.swu@phinmaed.com',        // Your Gmail
    pass: 'cnffbwtfytytfmrw'    // Replace with your actual App Password
  };

  console.log('🧪 Testing email credentials...');
  console.log('📧 Email:', testCredentials.user);
  console.log('🔑 Password length:', testCredentials.pass.length);

  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: testCredentials.user,
        pass: testCredentials.pass
      }
    });

    // Test connection
    await transporter.verify();
    console.log('✅ Email credentials are valid!');
    
    // Send test email
    const mailOptions = {
      from: testCredentials.user,
      to: testCredentials.user, // Send to yourself
      subject: 'Dorminder Email Test',
      text: 'This is a test email from Dorminder system.'
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Common fixes:');
      console.log('1. Make sure you\'re using Gmail App Password (16 characters)');
      console.log('2. Enable 2-Step Verification on your Gmail');
      console.log('3. Check that the email address is correct');
      console.log('4. Remove any spaces from the App Password');
    }
  }
}

testEmail();
