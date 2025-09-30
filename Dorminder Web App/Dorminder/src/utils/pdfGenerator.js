// Use dynamic import to avoid React Native compatibility issues
let jsPDF, Share;

const loadDependencies = async () => {
  if (!jsPDF) {
    const jsPDFModule = await import('jspdf');
    jsPDF = jsPDFModule.jsPDF;
  }
  if (!Share) {
    const ShareModule = await import('react-native-share');
    Share = ShareModule.default;
  }
};

export const generateBillPDF = async (bill, tenantData) => {
  try {
    // Load dependencies
    await loadDependencies();
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set up colors
    const primaryColor = '#293241';
    const secondaryColor = '#6b7280';
    const accentColor = '#FF6B35';
    
    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 30, 'F');
    
    // Logo/Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Dorminder', 20, 20);
    
    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Dormitory Management System', 20, 26);
    
    // Bill Information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL RECEIPT', 20, 50);
    
    // Bill Details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const billDetails = [
      ['Bill ID:', bill.id || 'N/A'],
      ['Billing Period:', bill.billingPeriod || 'N/A'],
      ['Bill Type:', bill.billType || 'Monthly Bill'],
      ['Generated Date:', new Date().toLocaleDateString()],
      ['Due Date:', bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A']
    ];
    
    let yPosition = 70;
    billDetails.forEach(([label, value]) => {
      doc.setTextColor(secondaryColor);
      doc.text(label, 20, yPosition);
      doc.setTextColor(0, 0, 0);
      doc.text(value, 80, yPosition);
      yPosition += 8;
    });
    
    // Tenant Information
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TENANT INFORMATION', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const tenantDetails = [
      ['Name:', tenantData ? `${tenantData.firstName} ${tenantData.lastName}` : 'N/A'],
      ['Room Number:', bill.roomNumber || 'N/A'],
      ['Contact:', tenantData?.contactNumber || 'N/A'],
      ['Email:', tenantData?.email || 'N/A']
    ];
    
    tenantDetails.forEach(([label, value]) => {
      doc.setTextColor(secondaryColor);
      doc.text(label, 20, yPosition);
      doc.setTextColor(0, 0, 0);
      doc.text(value, 80, yPosition);
      yPosition += 8;
    });
    
    // Bill Items
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL BREAKDOWN', 20, yPosition);
    
    yPosition += 10;
    
    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition - 5, 170, 10, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, yPosition);
    doc.text('Amount', 150, yPosition);
    
    yPosition += 15;
    
    // Bill items
    if (bill.items && bill.items.length > 0) {
      bill.items.forEach((item) => {
        doc.setFont('helvetica', 'normal');
        doc.text(item.description, 25, yPosition);
        doc.text(`₱${item.amount.toLocaleString()}`, 150, yPosition);
        yPosition += 8;
      });
    } else {
      doc.setFont('helvetica', 'normal');
      doc.text('Room Rental', 25, yPosition);
      doc.text(`₱${bill.totalAmount.toLocaleString()}`, 150, yPosition);
      yPosition += 8;
    }
    
    // Total
    yPosition += 10;
    doc.setFillColor(primaryColor);
    doc.rect(20, yPosition - 5, 170, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT', 25, yPosition);
    doc.text(`₱${bill.totalAmount.toLocaleString()}`, 150, yPosition);
    
    // Payment Status
    yPosition += 20;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT STATUS', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const statusColor = bill.status === 'Paid' ? '#10b981' : 
                       bill.status === 'Partially Paid' ? '#f59e0b' : '#ef4444';
    
    doc.setTextColor(statusColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`Status: ${bill.status}`, 20, yPosition);
    
    if (bill.status === 'Partially Paid' && bill.remainingBalance) {
      yPosition += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(`Remaining Balance: ₱${bill.remainingBalance.toLocaleString()}`, 20, yPosition);
    }
    
    // Footer
    yPosition += 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, 190, yPosition);
    
    yPosition += 10;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(secondaryColor);
    doc.text('This is a computer-generated receipt. No signature required.', 20, yPosition);
    doc.text('For inquiries, please contact your landlord.', 20, yPosition + 5);
    
    // Generate PDF as base64 string for React Native
    const pdfBase64 = doc.output('datauristring');
    
    return pdfBase64;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const sharePDF = async (pdfBase64, bill) => {
  try {
    // Load dependencies
    await loadDependencies();
    
    const filename = `bill-receipt-${bill.billingPeriod?.replace(/\s+/g, '-') || 'unknown'}.pdf`;
    
    const shareOptions = {
      title: 'Bill Receipt',
      message: `Bill receipt for ${bill.billingPeriod}`,
      url: pdfBase64,
      type: 'application/pdf',
      filename: filename,
    };
    
    await Share.open(shareOptions);
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw error;
  }
};
