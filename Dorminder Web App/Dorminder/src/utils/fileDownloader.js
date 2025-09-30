import { Alert, View, Text, StyleSheet, Dimensions } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

// Download receipt as text file
export const downloadReceiptAsText = async (receiptText, bill) => {
  try {
    const billingPeriod = bill?.billingPeriod || 'Unknown Period';
    const filename = `bill-receipt-${billingPeriod.replace(/\s+/g, '-')}.txt`;
    
    // Create a temporary file
    const { writeAsStringAsync, documentDirectory } = require('expo-file-system');
    const fileUri = `${documentDirectory}${filename}`;
    
    // Write the receipt text to file
    await writeAsStringAsync(fileUri, receiptText, { encoding: 'utf8' });
    
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Sharing Not Available',
        'Sharing is not available on this device. Please try taking a screenshot instead.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Share the file
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/plain',
      dialogTitle: `Bill Receipt - ${billingPeriod}`,
    });
  } catch (error) {
    console.error('Error sharing receipt:', error);
    Alert.alert(
      'Download Error',
      'Failed to create text receipt. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

// Download receipt as HTML file
export const downloadReceiptAsHTML = async (receiptText, bill) => {
  try {
    const billingPeriod = bill?.billingPeriod || 'Unknown Period';
    const filename = `bill-receipt-${billingPeriod.replace(/\s+/g, '-')}.html`;
    
    // Convert text receipt to HTML
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bill Receipt - ${billingPeriod}</title>
    <style>
        body { 
            font-family: 'Courier New', monospace; 
            margin: 20px; 
            background-color: #f5f5f5;
        }
        .receipt { 
            background-color: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        pre { 
            white-space: pre-wrap; 
            font-size: 12px; 
            line-height: 1.4;
            margin: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #293241;
        }
        .header h1 {
            color: #293241;
            margin: 0;
            font-size: 24px;
        }
        .header p {
            color: #6b7280;
            margin: 5px 0 0 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>DORMINDER</h1>
            <p>Dormitory Management System</p>
        </div>
        <pre>${receiptText}</pre>
    </div>
</body>
</html>`;
    
    // Create a temporary file
    const { writeAsStringAsync, documentDirectory } = require('expo-file-system');
    const fileUri = `${documentDirectory}${filename}`;
    
    // Write the HTML content to file
    await writeAsStringAsync(fileUri, htmlContent, { encoding: 'utf8' });
    
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Sharing Not Available',
        'Sharing is not available on this device. Please try taking a screenshot instead.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Share the file
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/html',
      dialogTitle: `Bill Receipt - ${billingPeriod}`,
    });
  } catch (error) {
    console.error('Error sharing HTML receipt:', error);
    Alert.alert(
      'Download Error',
      'Failed to create HTML receipt. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

// Show download options
export const showDownloadOptions = (receiptText, bill, receiptRef = null) => {
  const options = [
    {
      text: '📄 Save as Text File',
      onPress: () => downloadReceiptAsText(receiptText, bill)
    },
    {
      text: '🌐 Save as HTML File',
      onPress: () => downloadReceiptAsHTML(receiptText, bill)
    }
  ];

  // Add JPEG option if receiptRef is available
  if (receiptRef) {
    options.unshift({
      text: '🖼️ Save as JPEG Image',
      onPress: () => downloadReceiptAsJPEG(receiptRef, bill)
    });
  }

  options.push(
    {
      text: '📸 Take Screenshot',
      onPress: () => {
        Alert.alert(
          'Screenshot Instructions',
          'To save this receipt:\n\n1. Take a screenshot of the receipt\n2. The image will be saved to your photo gallery\n3. You can then share or print the image',
          [{ text: 'OK' }]
        );
      }
    },
    {
      text: '📋 Copy to Clipboard',
      onPress: () => {
        Alert.alert(
          'Copy Instructions',
          'To copy this receipt:\n\n1. Long press on the receipt text\n2. Select "Copy" from the menu\n3. Paste it into any text editor or messaging app',
          [{ text: 'OK' }]
        );
      }
    },
    {
      text: 'Cancel',
      style: 'cancel'
    }
  );

  Alert.alert(
    'Download Receipt',
    'Choose how you want to save your receipt:',
    options
  );
};

// Download receipt as JPEG image
export const downloadReceiptAsJPEG = async (receiptRef, bill) => {
  try {
    if (!receiptRef) {
      throw new Error('Receipt reference not available');
    }

    // Safe access to bill properties with fallbacks
    const billingPeriod = bill?.billingPeriod || 'Unknown Period';
    const filename = `bill-receipt-${billingPeriod.replace(/\s+/g, '-')}.jpg`;
    
    // Capture the receipt view as JPEG
    const uri = await captureRef(receiptRef, {
      format: 'jpg',
      quality: 0.9,
      result: 'tmpfile',
    });
    
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Sharing Not Available',
        'Sharing is not available on this device. Please try taking a screenshot instead.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Share the JPEG file
    await Sharing.shareAsync(uri, {
      mimeType: 'image/jpeg',
      dialogTitle: `Bill Receipt - ${billingPeriod}`,
    });
  } catch (error) {
    console.error('Error creating JPEG receipt:', error);
    Alert.alert(
      'Download Error',
      'Failed to create JPEG receipt. Please try taking a screenshot instead.',
      [{ text: 'OK' }]
    );
  }
};

// Create a styled receipt view for JPEG capture
export const createReceiptView = (receiptText, bill) => {
  const { width } = Dimensions.get('window');
  const receiptWidth = Math.min(width - 40, 400);
  
  return (
    <View style={[styles.receiptContainer, { width: receiptWidth }]}>
      {/* Header */}
      <View style={styles.receiptHeader}>
        <Text style={styles.receiptTitle}>DORMINDER</Text>
        <Text style={styles.receiptSubtitle}>Dormitory Management System</Text>
        <View style={styles.receiptDivider} />
      </View>
      
      {/* Receipt Content */}
      <View style={styles.receiptContent}>
        <Text style={styles.receiptText}>{receiptText}</Text>
      </View>
      
      {/* Footer */}
      <View style={styles.receiptFooter}>
        <Text style={styles.receiptFooterText}>
          Thank you for using Dorminder!
        </Text>
      </View>
    </View>
  );
};

// Simple text sharing
export const shareReceiptText = async (receiptText, bill) => {
  try {
    const billingPeriod = bill?.billingPeriod || 'Unknown Period';
    
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Sharing Not Available',
        'Sharing is not available on this device. Please try taking a screenshot instead.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Create a temporary text file
    const { writeAsStringAsync, documentDirectory } = require('expo-file-system');
    const filename = `bill-receipt-${billingPeriod.replace(/\s+/g, '-')}.txt`;
    const fileUri = `${documentDirectory}${filename}`;
    
    // Write the receipt text to file
    await writeAsStringAsync(fileUri, receiptText, { encoding: 'utf8' });
    
    // Share the file
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/plain',
      dialogTitle: `Bill Receipt - ${billingPeriod}`,
    });
  } catch (error) {
    console.error('Error sharing receipt text:', error);
    Alert.alert(
      'Share Error',
      'Failed to share receipt. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

// Styles for the receipt view
const styles = StyleSheet.create({
  receiptContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#293241',
    marginBottom: 4,
  },
  receiptSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  receiptDivider: {
    width: '100%',
    height: 2,
    backgroundColor: '#293241',
  },
  receiptContent: {
    marginBottom: 20,
  },
  receiptText: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
    color: '#1f2937',
  },
  receiptFooter: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  receiptFooterText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
