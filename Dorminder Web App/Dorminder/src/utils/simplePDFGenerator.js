// Remove react-native-share dependency for now
// import Share from 'react-native-share';

// Simple receipt generator that returns formatted text
export const generateSimpleReceipt = async (bill, tenantData) => {
  try {
    const receiptText = createReceiptText(bill, tenantData);
    return receiptText;
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw error;
  }
};

const createReceiptText = (bill, tenantData) => {
  const currentDate = new Date().toLocaleDateString();
  const dueDate = bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A';
  
  let receipt = '';
  receipt += '='.repeat(50) + '\n';
  receipt += '           DORMINDER RECEIPT\n';
  receipt += '      Dormitory Management System\n';
  receipt += '='.repeat(50) + '\n\n';
  
  receipt += 'BILL INFORMATION:\n';
  receipt += `Bill ID: ${bill.id || 'N/A'}\n`;
  receipt += `Billing Period: ${bill.billingPeriod || 'N/A'}\n`;
  receipt += `Bill Type: ${bill.billType || 'Monthly Bill'}\n`;
  receipt += `Generated Date: ${currentDate}\n`;
  receipt += `Due Date: ${dueDate}\n\n`;
  
  receipt += 'TENANT INFORMATION:\n';
  receipt += `Name: ${tenantData ? `${tenantData.firstName} ${tenantData.lastName}` : 'N/A'}\n`;
  receipt += `Room Number: ${bill.roomNumber || 'N/A'}\n`;
  receipt += `Contact: ${tenantData?.contactNumber || 'N/A'}\n`;
  receipt += `Email: ${tenantData?.email || 'N/A'}\n\n`;
  
  receipt += 'BILL BREAKDOWN:\n';
  receipt += '-'.repeat(30) + '\n';
  
  if (bill.items && bill.items.length > 0) {
    bill.items.forEach((item) => {
      receipt += `${item.description.padEnd(20)} ₱${item.amount.toLocaleString()}\n`;
    });
  } else {
    receipt += `Room Rental${' '.repeat(12)} ₱${bill.totalAmount.toLocaleString()}\n`;
  }
  
  receipt += '-'.repeat(30) + '\n';
  receipt += `TOTAL AMOUNT${' '.repeat(8)} ₱${bill.totalAmount.toLocaleString()}\n\n`;
  
  receipt += 'PAYMENT STATUS:\n';
  receipt += `Status: ${bill.status}\n`;
  
  if (bill.status === 'Partially Paid' && bill.remainingBalance) {
    receipt += `Remaining Balance: ₱${bill.remainingBalance.toLocaleString()}\n`;
  }
  
  receipt += '\n' + '='.repeat(50) + '\n';
  receipt += 'This is a computer-generated receipt.\n';
  receipt += 'No signature required.\n';
  receipt += 'For inquiries, please contact your landlord.\n';
  receipt += '='.repeat(50) + '\n';
  
  return receipt;
};

// Generate HTML receipt content
export const generateHTMLReceipt = async (bill, tenantData) => {
  try {
    const htmlContent = createHTMLReceipt(bill, tenantData);
    return htmlContent;
  } catch (error) {
    console.error('Error generating HTML receipt:', error);
    throw error;
  }
};

const createHTMLReceipt = (bill, tenantData) => {
  const currentDate = new Date().toLocaleDateString();
  const dueDate = bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bill Receipt - ${bill.billingPeriod}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; background: #293241; color: white; padding: 20px; }
        .section { margin: 20px 0; }
        .bill-table { width: 100%; border-collapse: collapse; }
        .bill-table th, .bill-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .bill-table th { background-color: #f2f2f2; }
        .total { font-weight: bold; background-color: #293241; color: white; }
        .status { padding: 5px 10px; border-radius: 5px; color: white; }
        .status.paid { background-color: #10b981; }
        .status.pending { background-color: #f59e0b; }
        .status.partially-paid { background-color: #ef4444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DORMINDER</h1>
        <p>Dormitory Management System</p>
    </div>
    
    <div class="section">
        <h2>Bill Information</h2>
        <table class="bill-table">
            <tr><td>Bill ID</td><td>${bill.id || 'N/A'}</td></tr>
            <tr><td>Billing Period</td><td>${bill.billingPeriod || 'N/A'}</td></tr>
            <tr><td>Bill Type</td><td>${bill.billType || 'Monthly Bill'}</td></tr>
            <tr><td>Generated Date</td><td>${currentDate}</td></tr>
            <tr><td>Due Date</td><td>${dueDate}</td></tr>
        </table>
    </div>
    
    <div class="section">
        <h2>Tenant Information</h2>
        <table class="bill-table">
            <tr><td>Name</td><td>${tenantData ? `${tenantData.firstName} ${tenantData.lastName}` : 'N/A'}</td></tr>
            <tr><td>Room Number</td><td>${bill.roomNumber || 'N/A'}</td></tr>
            <tr><td>Contact</td><td>${tenantData?.contactNumber || 'N/A'}</td></tr>
            <tr><td>Email</td><td>${tenantData?.email || 'N/A'}</td></tr>
        </table>
    </div>
    
    <div class="section">
        <h2>Bill Breakdown</h2>
        <table class="bill-table">
            <tr><th>Description</th><th>Amount</th></tr>
            ${bill.items && bill.items.length > 0 
              ? bill.items.map(item => `<tr><td>${item.description}</td><td>₱${item.amount.toLocaleString()}</td></tr>`).join('')
              : `<tr><td>Room Rental</td><td>₱${bill.totalAmount.toLocaleString()}</td></tr>`
            }
            <tr class="total"><td>TOTAL AMOUNT</td><td>₱${bill.totalAmount.toLocaleString()}</td></tr>
        </table>
    </div>
    
    <div class="section">
        <h2>Payment Status</h2>
        <p>Status: <span class="status ${bill.status.toLowerCase().replace(' ', '-')}">${bill.status}</span></p>
        ${bill.status === 'Partially Paid' && bill.remainingBalance 
          ? `<p>Remaining Balance: ₱${bill.remainingBalance.toLocaleString()}</p>`
          : ''
        }
    </div>
    
    <div class="section">
        <p><em>This is a computer-generated receipt. No signature required.</em></p>
        <p><em>For inquiries, please contact your landlord.</em></p>
    </div>
</body>
</html>`;
};
