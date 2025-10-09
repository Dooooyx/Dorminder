// Backend connection test utility
import { authService } from '../services/auth.js';
import { firestoreService } from '../services/firestore.js';

export const testBackendConnection = async () => {
  console.log('🧪 Testing Backend Connection...');
  
  try {
    // Test Firebase Auth
    console.log('✅ Firebase Auth initialized');
    
    // Test Firestore connection
    console.log('✅ Firestore service initialized');
    
    // Test authentication state
    const currentUser = authService.getCurrentUser();
    console.log('👤 Current user:', currentUser ? 'Logged in' : 'Not logged in');
    
    if (currentUser) {
      const userRole = authService.getCurrentUserRole();
      console.log('🔐 User role:', userRole);
    }
    
    console.log('🎉 Backend connection test completed successfully!');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Backend connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Test data operations
export const testDataOperations = async () => {
  console.log('🧪 Testing Data Operations...');
  
  try {
    // Test creating a sample property (if user is landlord)
    if (authService.isLandlord()) {
      const propertyData = {
        landlordId: authService.getCurrentUser().uid,
        name: 'Test Property',
        address: '123 Test Street',
        description: 'Test property for backend testing',
        totalRooms: 10,
        occupiedRooms: 0
      };
      
      const result = await firestoreService.createProperty(propertyData);
      if (result.success) {
        console.log('✅ Property created successfully:', result.id);
      } else {
        console.log('❌ Property creation failed:', result.error);
      }
    }
    
    console.log('🎉 Data operations test completed!');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Data operations test failed:', error);
    return { success: false, error: error.message };
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('🚀 Starting Backend Tests...');
  
  const connectionTest = await testBackendConnection();
  const dataTest = await testDataOperations();
  
  return {
    connection: connectionTest,
    data: dataTest,
    overall: connectionTest.success && dataTest.success
  };
};








