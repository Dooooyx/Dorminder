import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import TenantInfoHeader from '../components/TenantInfoHeader';
import TopNav from '../components/TopNav';
import BotNav from '../components/BotNav';

const TenantRules = ({ navigation }) => {
  const [activeTab, setActiveTab] = React.useState('rules');
  const userName = 'Chrystls';

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'dashboard') {
      navigation.navigate('TenantDashboard');
    }
    // For other tabs, show placeholder content within this screen
    // In the future, these can be separate screens
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
    // Add your notification logic here
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
    // Add your profile logic here
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
    // Add your menu logic here
  };

  const rulesData = [
    {
      icon: '✓',
      title: 'General Conduct',
      rules: [
        'Respect fellow tenants, staff, and visitors at all times.',
        'Keep hallways, shared spaces, and your room clean and orderly.',
        'Smoking, vaping, and illegal substances are strictly prohibited inside the premises.'
      ]
    },
    {
      icon: '🌙',
      title: 'Quiet Hours',
      rules: [
        'Quiet hours are observed from 9:00 PM - 7:00 AM.',
        'Loud music, shouting, or gatherings are not allowed during quiet hours.'
      ]
    },
    {
      icon: '👥',
      title: 'Visitors Policy',
      rules: [
        'Visitors are only allowed between 8:00 AM - 9:00 PM.',
        'Overnight guests are not permitted unless approved by the landlord.',
        'Tenants are responsible for their guests\' behavior.'
      ]
    },
    {
      icon: '🔧',
      title: 'Maintenance & Repairs',
      rules: [
        'Report any issues (plumbing, electricity, damage) through the Requests page.',
        'Do not attempt major repairs on your own.',
        'Tenants will be charged for damages caused by negligence.'
      ]
    },
    {
      icon: '$',
      title: 'Payments & Rent',
      rules: [
        'Rent is due on the 30th of every month (unless otherwise stated).',
        'Late payments may incur penalties as set by the landlord.',
        'Official receipts will be available in the Payments page.'
      ]
    },
    {
      icon: '🏢',
      title: 'Facilities Usage',
      rules: [
        'Shared areas (kitchen, laundry, lounge) must be cleaned after use.',
        'Appliances should be used responsibly to save electricity and water.',
        'Unauthorized appliances (e.g., hot plates, heavy electronics) are not allowed in rooms.'
      ]
    },
    {
      icon: '🔒',
      title: 'Safety & Security',
      rules: [
        'Always lock your room and the main gate when leaving.',
        'Fire exits must remain clear at all times.',
        'Lost keys must be reported immediately and may require a replacement fee.'
      ]
    }
  ];

  const RuleSection = ({ icon, title, rules }) => (
    <View style={styles.ruleSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.rulesList}>
        {rules.map((rule, index) => (
          <View key={index} style={styles.ruleItem}>
            <Text style={styles.ruleNumber}>{index + 1}.</Text>
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Show TenantInfoHeader only for rules tab, TopNav for other tabs */}
      {activeTab === 'rules' ? (
        <TenantInfoHeader 
          roomNumber="209" 
          contractDate="Dec 2025"
          showLogo={true}
          headerTitle={null}
          containerStyle={styles.tenantInfoContainer}
          roomInfoStyle={styles.tenantRoomInfo}
        />
      ) : (
        <TopNav
          userName={userName}
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
          onMenuPress={handleMenuPress}
        />
      )}
      
      <View style={styles.content}>
        {activeTab === 'rules' && (
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.rulesContent}>
              {/* Main Title */}
              <Text style={styles.mainTitle}>Boarding House Rules & Regulations</Text>
              
              {/* Introduction */}
              <Text style={styles.introduction}>
                Welcome to your dormitory! Please read and follow the guidelines below to ensure a safe, respectful, and comfortable living environment.
              </Text>
              
              {/* Rules Sections */}
              {rulesData.map((section, index) => (
                <RuleSection
                  key={index}
                  icon={section.icon}
                  title={section.title}
                  rules={section.rules}
                />
              ))}
              
              {/* Note Section */}
              <View style={styles.noteSection}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteIcon}>📎</Text>
                  <Text style={styles.noteTitle}>Note</Text>
                </View>
                <Text style={styles.noteText}>
                  Rules are subject to updates. Any changes will be announced in the Announcements page.
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
        
        {activeTab === 'myroom' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>My Room Screen</Text>
            <Text style={styles.placeholderSubtext}>Room details and management</Text>
          </View>
        )}
        
        {activeTab === 'request' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Request Screen</Text>
            <Text style={styles.placeholderSubtext}>Submit maintenance requests</Text>
          </View>
        )}
        
        {activeTab === 'payment' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Payment Screen</Text>
            <Text style={styles.placeholderSubtext}>Manage your payments</Text>
          </View>
        )}
      </View>

      <BotNav activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Plain white background
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  rulesContent: {
    padding: 20,
    paddingBottom: 100, // Space for bottom navigation
  },
  tenantInfoContainer: {
    paddingHorizontal: 20, // Match content padding
  },
  tenantRoomInfo: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 0, // Remove default margin
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E53E3E', // Reddish-orange color from image
    marginBottom: 12,
    textAlign: 'left',
  },
  introduction: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'left',
  },
  ruleSection: {
    marginBottom: 24,
    // Removed card styling for plain white background
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E53E3E', // Reddish-orange color from image
    flex: 1,
  },
  rulesList: {
    paddingLeft: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  ruleNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
    minWidth: 20,
  },
  ruleText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
    flex: 1,
  },
  noteSection: {
    marginTop: 20,
    // Removed card styling for plain white background
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E53E3E', // Reddish-orange color from image
  },
  noteText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  placeholderText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default TenantRules;
