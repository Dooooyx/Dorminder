// Navigation utility to handle common navigation logic
export const handleTabNavigation = (navigation, tabId, currentScreen) => {
  switch (tabId) {
    case 'dashboard':
      if (currentScreen !== 'TenantDashboard') {
        navigation.navigate('TenantDashboard');
      }
      break;
    case 'news':
      if (currentScreen !== 'NewsScreen') {
        navigation.navigate('NewsScreen');
      }
      break;
    case 'rules':
      if (currentScreen !== 'TenantRules') {
        navigation.navigate('TenantRules');
      }
      break;
    case 'request':
      if (currentScreen !== 'TenantRequests') {
        navigation.navigate('TenantRequests');
      }
      break;
    case 'payment':
      if (currentScreen !== 'TenantPayment') {
        navigation.navigate('TenantPayment');
      }
      break;
    default:
      console.log(`Unknown tab: ${tabId}`);
  }
};

// Common notification and profile handlers
export const handleNotificationPress = () => {
  console.log('Notification pressed');
  // Add your notification logic here
};

export const handleProfilePress = (navigation) => {
  console.log('Profile pressed');
  // Add your profile logic here
};

export const handleMenuPress = (setIsBurgerNavVisible) => {
  console.log('Menu pressed');
  setIsBurgerNavVisible(prev => !prev);
};






