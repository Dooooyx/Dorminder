# EmailJS Template Content for "Tenant Registration Informations"

## Template Configuration

### **Template ID**: `tenant_credentials`
### **Service ID**: `service_7f292zn`

---

## Email Configuration Fields

### **To Email** *(Required)*
```
{{to_email}}
```

### **From Name**
```
Dorminder System
```

### **From Email** *(Required)*
```
Use Default Email Address ✓ (checked)
```

### **Reply To**
```
{{landlord_name}}
```

### **Subject** *(Required)*
```
Welcome to Dorminder - Your Account & Registration Details
```

---

## Email Content (HTML)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Dorminder</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #3D5A80;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .section {
            margin-bottom: 25px;
            padding: 15px;
            background-color: white;
            border-radius: 5px;
            border-left: 4px solid #3D5A80;
        }
        .section h3 {
            color: #3D5A80;
            margin-top: 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
        }
        .label {
            font-weight: bold;
            color: #555;
        }
        .value {
            color: #333;
        }
        .credentials {
            background-color: #e8f4fd;
            border: 2px solid #3D5A80;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        .credentials h2 {
            color: #3D5A80;
            margin-top: 0;
        }
        .login-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏠 Welcome to Dorminder!</h1>
        <p>Your Dormitory Management System</p>
    </div>

    <div class="content">
        <p>Dear <strong>{{tenant_name}}</strong>,</p>
        
        <p>Welcome to Dorminder! Your account has been successfully created and you can now access your tenant portal. Below are your complete registration details and login credentials.</p>

        <!-- Login Credentials Section -->
        <div class="credentials">
            <h2>🔑 Your Login Credentials</h2>
            <div class="login-info">
                <p><strong>Email:</strong> {{to_email}}</p>
                <p><strong>Password:</strong> {{password}}</p>
            </div>
            <p><em>Please keep these credentials safe and change your password after your first login.</em></p>
        </div>

        <!-- Personal Information Section -->
        <div class="section">
            <h3>👤 Personal Information</h3>
            <div class="info-row">
                <span class="label">Full Name:</span>
                <span class="value">{{first_name}} {{middle_initial}} {{last_name}}</span>
            </div>
            <div class="info-row">
                <span class="label">Email Address:</span>
                <span class="value">{{email_address}}</span>
            </div>
            <div class="info-row">
                <span class="label">Contact Number:</span>
                <span class="value">{{contact_number}}</span>
            </div>
            <div class="info-row">
                <span class="label">Emergency Contact:</span>
                <span class="value">{{emergency_contact_name}}</span>
            </div>
            <div class="info-row">
                <span class="label">Emergency Contact Number:</span>
                <span class="value">{{emergency_contact_number}}</span>
            </div>
        </div>

        <!-- Lease Information Section -->
        <div class="section">
            <h3>🏠 Lease Information</h3>
            <div class="info-row">
                <span class="label">Property Name:</span>
                <span class="value">{{property_name}}</span>
            </div>
            <div class="info-row">
                <span class="label">Room Number:</span>
                <span class="value">{{room_number}}</span>
            </div>
            <div class="info-row">
                <span class="label">Monthly Rent:</span>
                <span class="value">₱{{rent_amount}}</span>
            </div>
            <div class="info-row">
                <span class="label">Lease Start Date:</span>
                <span class="value">{{lease_start_date}}</span>
            </div>
            <div class="info-row">
                <span class="label">Lease End Date:</span>
                <span class="value">{{lease_end_date}}</span>
            </div>
            <div class="info-row">
                <span class="label">Initial Payment Status:</span>
                <span class="value">{{initial_payment_status}}</span>
            </div>
            <div class="info-row">
                <span class="label">Account Status:</span>
                <span class="value">{{status}}</span>
            </div>
        </div>

        <!-- Landlord Information Section -->
        <div class="section">
            <h3>👨‍💼 Landlord Information</h3>
            <div class="info-row">
                <span class="label">Landlord Name:</span>
                <span class="value">{{landlord_name}}</span>
            </div>
        </div>

        <!-- Documents Section -->
        <div class="section">
            <h3>📄 Documents</h3>
            <div class="info-row">
                <span class="label">Valid ID:</span>
                <span class="value">
                    {{#if valid_id_url}}
                        <a href="{{valid_id_url}}" target="_blank" style="color: #3D5A80; text-decoration: none;">📎 Download Valid ID</a>
                    {{else}}
                        <em style="color: #999;">Not provided</em>
                    {{/if}}
                </span>
            </div>
            <div class="info-row">
                <span class="label">Lease Contract:</span>
                <span class="value">
                    {{#if lease_contract_url}}
                        <a href="{{lease_contract_url}}" target="_blank" style="color: #3D5A80; text-decoration: none;">📎 Download Lease Contract</a>
                    {{else}}
                        <em style="color: #999;">Not provided</em>
                    {{/if}}
                </span>
            </div>
        </div>

        <!-- Next Steps Section -->
        <div class="section">
            <h3>📋 Next Steps</h3>
            <ol>
                <li>Log in to your tenant portal using the credentials provided above</li>
                <li>Complete your profile setup</li>
                <li>Review your lease agreement and payment schedule</li>
                <li>Set up your payment method</li>
                <li>Download the Dorminder mobile app for easy access</li>
            </ol>
        </div>

        <p>If you have any questions or need assistance, please don't hesitate to contact your landlord or the Dorminder support team.</p>

        <p>Welcome to the Dorminder family!</p>

        <div class="footer">
            <p><strong>Dorminder - Smart Dormitory Management</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
```

---

## Template Variables Used

The following variables are automatically populated from the tenant registration data:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{to_email}}` | Tenant's email address | `john.doe@email.com` |
| `{{tenant_name}}` | Tenant's full name | `John Michael Doe` |
| `{{password}}` | Login password | `TempPass123!` |
| `{{first_name}}` | First name | `John` |
| `{{middle_initial}}` | Middle initial | `M` |
| `{{last_name}}` | Last name | `Doe` |
| `{{email_address}}` | Email address | `john.doe@email.com` |
| `{{contact_number}}` | Phone number | `+63 912 345 6789` |
| `{{emergency_contact_name}}` | Emergency contact | `Jane Doe` |
| `{{emergency_contact_number}}` | Emergency contact phone | `+63 912 345 6790` |
| `{{property_name}}` | Property name | `Dorminder Property` |
| `{{room_number}}` | Room number | `Room 101` |
| `{{rent_amount}}` | Monthly rent | `5000` |
| `{{lease_start_date}}` | Lease start date | `2024-01-01` |
| `{{lease_end_date}}` | Lease end date | `2024-12-31` |
| `{{initial_payment_status}}` | Payment status | `Pending` |
| `{{status}}` | Account status | `Active` |
| `{{landlord_name}}` | Landlord name | `Landlord` |
| `{{valid_id_url}}` | Valid ID document URL | `https://storage.googleapis.com/...` |
| `{{lease_contract_url}}` | Lease contract document URL | `https://storage.googleapis.com/...` |

---

## 🔧 **Variable Mapping Fixes Applied**

The following variable mapping issues have been fixed in `emailServiceFree.js`:

| EmailJS Template Variable | Data Source | Status |
|---------------------------|-------------|---------|
| `{{email_address}}` | `tenantData.tenantEmail` | ✅ Fixed |
| `{{emergency_contact_name}}` | `tenantData.emergencyContact` | ✅ Fixed |
| `{{rent_amount}}` | `tenantData.monthlyRent` | ✅ Fixed |
| `{{initial_payment_status}}` | `tenantData.initialPaymentStatus` | ✅ Fixed |
| `{{landlord_name}}` | `tenantData.landlordName` | ✅ Fixed |
| `{{property_name}}` | `tenantData.propertyName` | ✅ Fixed |
| `{{middle_initial}}` | `tenantData.middleName` | ✅ Fixed |

---

## 🐛 **Debugging Information**

To debug missing information, check the console logs when sending emails. The system now logs:
- `📧 Template params:` - Shows all variables being sent to EmailJS
- `📧 Sending tenant credentials email to:` - Confirms email recipient

If information is still missing, check:
1. **Data source**: Ensure the tenant registration form is collecting all required fields
2. **Variable names**: Verify the EmailJS template uses the exact variable names listed above
3. **Console logs**: Check browser console for the template parameters being sent

---

## Setup Instructions

1. **Copy the HTML content** above into your EmailJS template editor
2. **Update the configuration fields** as specified
3. **Save the template** with ID: `tenant_credentials`
4. **Test the template** using the "Test It" button with sample data
5. **Deploy** and test with actual tenant registration

---

## Notes

- The template is responsive and will look good on both desktop and mobile
- All styling is inline for maximum email client compatibility
- The template includes all tenant information in a well-organized format
- Login credentials are prominently displayed for easy access
- The design matches the Dorminder brand colors (#3D5A80)
