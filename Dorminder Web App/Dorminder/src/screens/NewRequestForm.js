import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BotNav from '../components/BotNav';
import { requestService } from '../services/requestService';
import { cloudinaryService } from '../services/cloudinaryService';

const NewRequestForm = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  const handleTabPress = (tabId) => {
    if (tabId === 'dashboard') {
      navigation.navigate('TenantDashboard');
    } else if (tabId === 'announcement') {
      navigation.navigate('AnnouncementsScreen');
    } else if (tabId === 'rules') {
      navigation.navigate('TenantRules');
    } else if (tabId === 'request') {
      navigation.navigate('TenantRequests');
    } else if (tabId === 'payment') {
      navigation.navigate('TenantPayment');
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (selectedImage) {
        const uploadResult = await cloudinaryService.uploadImage(selectedImage.uri);
        imageUrl = uploadResult.secure_url;
      }

      // Submit request
      const result = await requestService.submitRequest({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl,
        priority: priority
      });

      if (result.success) {
        Alert.alert(
          'Success',
          'Your request has been submitted successfully! The landlord will see it in their dashboard.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert(
        'Error',
        'Failed to submit request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <View style={styles.backButtonIcon}>
            <Text style={styles.backArrow}>←</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Title and Subtitle */}
      <View style={styles.titleSection}>
        <Text style={styles.sectionTitle}>Submit Request</Text>
        <Text style={styles.subtitle}>Send your requests here and we'll take care of the rest!</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Title Field */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Enter Title</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter your request title..."
              placeholderTextColor="#A0AEC0"
              maxLength={50}
            />
            <Text style={styles.characterCount}>{title.length}/50</Text>
          </View>

          {/* Description Field */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Enter description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your request in detail..."
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor="#A0AEC0"
              maxLength={1000}
            />
            <Text style={styles.characterCount}>{description.length}/1000</Text>
          </View>

          {/* Upload Image Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Upload Image (Optional)</Text>
            <TouchableOpacity
              style={styles.uploadArea}
              onPress={handleImagePicker}
              activeOpacity={0.7}
            >
              {selectedImage ? (
                <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <View style={styles.uploadIcon}>
                    <Text style={styles.uploadIconText}>↑</Text>
                  </View>
                  <Text style={styles.uploadText}>Upload Image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Priority Selector */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Priority Level</Text>
            <View style={styles.priorityContainer}>
              {['low', 'medium', 'high'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priorityButton,
                    priority === level && styles.priorityButtonActive
                  ]}
                  onPress={() => setPriority(level)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    priority === level && styles.priorityButtonTextActive
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Request</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BotNav activeTab="request" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginTop: 4,
  },
  backButtonIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#3182CE',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#2C5282',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A202C',
    backgroundColor: '#FFFFFF',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A202C',
    minHeight: 120,
    backgroundColor: '#FFFFFF',
  },
  characterCount: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'right',
    marginTop: 4,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    minHeight: 120,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadIconText: {
    fontSize: 24,
    color: '#A0AEC0',
    fontWeight: 'bold',
  },
  uploadText: {
    fontSize: 16,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#FF6B47',
    borderColor: '#FF6B47',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  priorityButtonTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#FF6B47',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 10,
  },
});

export default NewRequestForm;