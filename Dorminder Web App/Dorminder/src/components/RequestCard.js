import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Dimensions, ScrollView } from 'react-native';

import ic_prev from '../assets/icons/ic_prev.png';
import ic_next from '../assets/icons/ic_next.png';

const RequestCard = ({ request, onPress, expanded = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef(null);
  
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const getBorderColor = (category, status) => {
    const cat = (category || '').toString().toLowerCase();
    if (cat === 'report') return '#EE6C4D'; // orange for reports
    if (status === 'completed') return '#2F855A'; // green
    return '#3182CE'; // blue for requests/default
  };

  const createdAt = request.createdAt?.toDate ? request.createdAt.toDate() : (request.createdAt?.seconds ? new Date(request.createdAt.seconds * 1000) : null);
  const dateStr = createdAt
    ? `${createdAt.toLocaleDateString()}  |  ${createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : (request.date || '');

  const title = request.title || request.type || 'Request';
  const roomInfo = request.roomNumber ? `ROOM # ${request.roomNumber}` : (request.tenantName ? request.tenantName : '');
  const borderColor = getBorderColor(request.category, request.status);

  // Get all images (both old imageUrl and new images array)
  const getAllImages = () => {
    const images = [];
    if (request.imageUrl) images.push(request.imageUrl);
    if (request.images && request.images.length > 0) {
      images.push(...request.images);
    }
    return images;
  };

  const images = getAllImages();

  // Scroll to current image when modal opens or index changes
  useEffect(() => {
    if (imageModalVisible && scrollViewRef.current && images.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: currentImageIndex * screenWidth,
          animated: false
        });
      }, 100);
    }
  }, [imageModalVisible, currentImageIndex, screenWidth, images.length]);

  const handleImagePress = (index) => {
    console.log('🖼️ Opening image modal:', { index, totalImages: images.length, images });
    setCurrentImageIndex(index);
    setImageModalVisible(true);
  };

  const handlePrevImage = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    console.log('⬅️ Previous image:', { from: currentImageIndex, to: newIndex, total: images.length });
    setCurrentImageIndex(newIndex);
  };

  const handleNextImage = () => {
    const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    console.log('➡️ Next image:', { from: currentImageIndex, to: newIndex, total: images.length });
    setCurrentImageIndex(newIndex);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <>
      <View style={[styles.card, { borderLeftColor: borderColor }]}>
        <View style={styles.cardContent}>
          <Text style={styles.requestType}>{title}</Text>
          <Text style={styles.roomInfo}>
            {roomInfo}{roomInfo ? ' - ' : ''}{dateStr}
          </Text>
        </View>

        {showDetails && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailsLeft}>
              {!!request.description && (
                <Text style={styles.detailsText}>{request.description}</Text>
              )}
            </View>
            
            {/* Images Display - Show only first image */}
            {images.length > 0 && (
              <View style={styles.imagesContainer}>
                <TouchableOpacity 
                  onPress={() => handleImagePress(0)}
                  style={styles.imageWrapper}
                >
                  <Image 
                    source={{ uri: images[0] }} 
                    style={styles.detailsImage} 
                    resizeMode="cover" 
                  />
                  {/* Image Counter Badge - Show if more than 1 image */}
                  {images.length > 1 && (
                    <View style={styles.imageCounterBadge}>
                      <Text style={styles.imageCounterText}>+{images.length - 1}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        
        {/* See More/Less Button - Always at bottom */}
        <TouchableOpacity 
          style={styles.seeMoreButton}
          onPress={toggleDetails}
        >
          <Text style={styles.seeMoreText}>
            {showDetails ? 'See Less' : 'See More'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Modal with Slider */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalCloseArea}
            onPress={() => setImageModalVisible(false)}
          />
          
          <View style={styles.modalContent}>
            {/* Image Counter */}
            <Text style={styles.imageCounter}>
              {currentImageIndex + 1} / {images.length}
            </Text>
            
            {/* Main Image */}
            <ScrollView 
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                setCurrentImageIndex(index);
              }}
              style={styles.imageScrollView}
            >
              {images.map((imageUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={[styles.modalImage, { width: screenWidth }]}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
            
            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={handlePrevImage}
              >
                <Image source={ic_prev} style={styles.navIcon} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={handleNextImage}
              >
                <Image source={ic_next} style={styles.navIcon} />
              </TouchableOpacity>
            </View>
            
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setImageModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕ Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flex: 1,
  },
  detailsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#E2E8F0',
  },
  detailsLeft: {
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 16,
    color: '#1A202C',
    lineHeight: 24,
    textDecorationLine: 'none',
  },
  detailsImage: {
    width: 120,
    height: 100,
    borderRadius: 6,
  },
  imageWrapper: {
    position: 'relative',
  },
  imageCounterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  seeMoreButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3182CE',
    borderRadius: 6,
  },
  seeMoreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCounter: {
    position: 'absolute',
    top: 60,
    left: 20,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageScrollView: {
    flex: 1,
    width: '100%',
  },
  modalImage: {
    height: '80%',
    alignSelf: 'center',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 20,
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  requestType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 4,
  },
  roomInfo: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
});

export default RequestCard;
