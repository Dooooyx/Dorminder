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
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BotNav from '../components/BotNav';
import { requestService } from '../services/requestService';
import { cloudinaryService } from '../services/cloudinaryService';

const NewRequestForm = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [priority, setPriority] = useState('request');
  const [loading, setLoading] = useState(false);

  const handleTabPress = (tabId) => {
    if (tabId === 'dashboard') {
      navigation.navigate('TenantDashboard');
    } else if (tabId === 'news') {
      navigation.navigate('NewsScreen');
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
      // Check existing permission first
      let permission = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permission.granted) {
        if (permission.canAskAgain) {
          permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        }

        if (!permission.granted) {
          Alert.alert(
            'Permission required',
            'We need access to your photos to upload an image.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.9,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets?.length) {
        setSelectedImages(result.assets);
      }
    } catch (error) {
      console.error('ImagePicker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleChooseSource = () => {
    Alert.alert(
      'Add photo',
      'Choose a source',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'From Gallery', onPress: handleImagePicker },
        { text: 'Use Camera', onPress: handleOpenCamera },
      ]
    );
  };

  const handleOpenCamera = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Permission required', 'Camera access is needed to take a photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.9,
      });
      if (!result.canceled && result.assets?.length) {
        setSelectedImages(prev => [...prev, ...result.assets]);
      }
    } catch (e) {
      console.error('Camera error:', e);
      Alert.alert('Error', 'Failed to take photo.');
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
      let imageUrls = [];
      
      // Upload images if selected
      if (selectedImages.length) {
        for (const asset of selectedImages) {
          const uploadResult = await cloudinaryService.uploadFile(asset.uri);
          if (uploadResult.success) {
            imageUrls.push(uploadResult.downloadURL);
          } else {
            console.error('Image upload failed:', uploadResult.error);
            Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
            return;
          }
        }
      }

      // Submit request
      const result = await requestService.submitRequest({
        title: title.trim(),
        description: description.trim(),
        images: imageUrls,
        category: priority
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
            <View>
              <TouchableOpacity style={styles.uploadArea} onPress={handleChooseSource} activeOpacity={0.7}>
                <View style={styles.uploadPlaceholder}>
                  <View style={styles.uploadIcon}>
                    <Text style={styles.uploadIconText}>＋</Text>
                  </View>
                  <Text style={styles.uploadText}>Add photos (Gallery or Camera)</Text>
                </View>
              </TouchableOpacity>
              {selectedImages.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {selectedImages.map((a, i) => (
                    <Image key={i} source={{ uri: a.uri }} style={{ width: 90, height: 70, borderRadius: 6 }} />
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Category Selector */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Type</Text>
            <View style={styles.priorityContainer}>
              {['request', 'report'].map((level) => (
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
                    {level === 'request' ? 'Request' : 'Report'}
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
              <Text style={styles.submitButtonText}>Submit</Text>
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