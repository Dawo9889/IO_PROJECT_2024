import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { fetchOriginalPhotos, fetchPhoto } from '@/constants/api';
import { getAccessToken } from '@/constants/storage';

interface sliderProps {
    currentIndex: number | null;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number | null>>;
    isSliderOpen: boolean;
    setIsSliderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    pageCount: number | null;
    partyID: string;
}

const Slider = ({ currentIndex, setCurrentIndex, isSliderOpen, setIsSliderOpen, pageCount, partyID}: sliderProps) => {
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [currentPhoto, setCurrentPhoto] = useState<any>(null);
    const [photos, setPhotos] = useState<any[]>([]);

    const handleGetAccessToken = async () => {
        setAccessToken(await getAccessToken());
    }

    useEffect(() => {
      const fetchPhotos = async () => {
        if (partyID && currentIndex !== null && pageCount !== null) {
          setLoading(true);
          try {
            const allPhotos = await fetchOriginalPhotos(partyID, pageCount);
            setPhotos(allPhotos);
            // setPhotos(allPhotos.map(photo => photo.filePath)); // Extract the filePath for Image source
          } catch (error) {
            console.error('Error fetching full-size photos:', error);
          } finally {
            setLoading(false);
          }
        }
      };
      handleGetAccessToken();
      fetchPhotos();
    }, []);

    useEffect(() => {
      if (currentIndex === null) return;
  
      const loadPhoto = async () => {
        if (!photos[currentIndex]) return;
        setLoading(true);
        try {
          const data = await fetchPhoto(photos[currentIndex]);
  
          setCurrentPhoto({
            photoSrc: data.photoUri, // Use URI directly
            thumbnailSrc: data.thumbnailUri, // Use URI directly
            description: photos[currentIndex].description || '',
            author: photos[currentIndex].author == 'anonymous' ? '' : `~ ${photos[currentIndex].author}` 
          });
        } catch (err) {
          console.error('Error loading photo:', err);
          setCurrentPhoto(null);
        } finally {
          setLoading(false);
        }
      };
  
      loadPhoto();
    }, [photos, currentIndex]);
  
    const [isSwiping, setIsSwiping] = useState(false); // Add a flag to control swiping
    // Gesture Handler callback to detect swipe
    const onSwipeGesture = (event: any) => {
      if (isSwiping) return; // Prevent multiple swipes at once
      const { translationX } = event.nativeEvent; // Get the swipe translation in the X axis
      if (Math.abs(translationX) > 100) {
        if (translationX > 0) {
          setIsSwiping(true); // Set the flag to prevent multiple swipes
          // Swipe Right (go to previous image)
          setCurrentIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1));
        } else {
          // Swipe Left (go to next image)
          setIsSwiping(true); // Set the flag to prevent multiple swipes
          setCurrentIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0));
        }
      }
        // Reset the swiping flag after a short delay
      setTimeout(() => {
        setIsSwiping(false);
      }, 300); // Adjust timeout as needed
    };
  
    if (currentIndex === null || photos.length === 0) return null; // Return nothing if currentIndex is invalid or photos are not loaded
  
    return (
      <Modal
        visible={isSliderOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setIsSliderOpen(false);
          setCurrentIndex(null);
        }}
      >
        <GestureHandlerRootView className="flex-1">
          <PanGestureHandler onGestureEvent={onSwipeGesture}>
            <View className="flex-1 justify-center items-center">
              {loading || !currentPhoto ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <>
                  <Image
                    source={{ uri: currentPhoto.photoSrc }} // Use the fetched local URI
                    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                    onError={(error) => console.error('Error loading image:', currentPhoto.photoSrc)}
                  />
                  {(currentPhoto.description || currentPhoto.author) && (
                  <View className='absolute bottom-[20px] border-2 border-white rounded-lg p-3 w-[90%] h-[80px] items-center justify-center'>
                    <Text className='text-white'>{`${currentPhoto.description} ${currentPhoto.author}`}</Text>
                  </View>
                  )}
                </>
              )}
              <TouchableOpacity
                onPress={() => setIsSliderOpen(false)}
                className="absolute top-[65px] right-2 p-3 bg-red-500 rounded-md"
              >
                <Text style={{ color: 'white' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </Modal>
    );
  };

export default Slider