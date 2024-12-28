import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const WeddingPhotoSlider = ({ weddingId,pageCount, index, onClose }) => {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);

  const authData = JSON.parse(localStorage.getItem('auth'));
  const accessToken = authData?.accessToken;

  const closeSlider = () => onClose();

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setIsVertical(naturalHeight > naturalWidth);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      const allPhotos = [];
      try {
        for (let i = 1; i <= pageCount; i++) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/image/path?weddingId=${weddingId}&pageNumber=${i}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const sortedData = response.data.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          allPhotos.push(...sortedData);
        }
        setPhotos(allPhotos);
      } catch (err) {
        console.error('Błąd podczas pobierania zdjęć:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [weddingId]);
  

  useEffect(() => {
    const loadPhoto = async () => {
      if (!photos[currentIndex]) return;
      setLoading(true);
      try {
        const photoRes = await axios.get(photos[currentIndex].filePath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'arraybuffer',
        });

        const thumbnailRes = await axios.get(photos[currentIndex].thumbnailPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'arraybuffer',
        });

        const photoBlob = new Blob([photoRes.data], { type: 'image/jpeg' });
        const thumbnailBlob = new Blob([thumbnailRes.data], { type: 'image/jpeg' });

        setCurrentPhoto({
          photoSrc: URL.createObjectURL(photoBlob),
          thumbnailSrc: URL.createObjectURL(thumbnailBlob),
        });
      } catch (err) {
        console.error(`Błąd podczas ładowania zdjęcia:`, err);
        setCurrentPhoto(null);
      } finally {
        setLoading(false);
      }
    };

    loadPhoto();
  }, [currentIndex, photos]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={closeSlider}
    >
      {loading || !currentPhoto ? (
        <div className="min-h-[500px] flex justify-center items-center">
          <svg
            className="animate-spin h-12 w-12 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C6.48 0 0 6.48 0 12h4zm2 5.29a8.959 8.959 0 01-2-2.29H0c.8 2.21 2.27 4.21 4 5.71v-3.42z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="flex flex-col">
          <div
            className="max-w-4xl flex items-center m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={closeSlider}
            >
              &times;
            </button>
            {currentIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white text-3xl bg-gray-800 p-2 rounded-full hover:bg-gray-700 opacity-50 hover:opacity-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
</svg>

              </button>
            )}
        <div className='min-h-[250px] lg:min-h-[600px]'>
            <motion.div key={currentIndex} className="flex justify-center">
              <LazyLoadImage
                src={currentPhoto?.photoSrc}
                placeholderSrc={currentPhoto?.thumbnailSrc}
                effect="blur"
                alt={`Photo ${currentIndex + 1}`}
                className={`mx-auto rounded-lg ${
                  isVertical
                    ? 'max-h-[90vh] max-w-[70vw]'
                    : 'max-w-full max-h-screen'
                } object-contain`}
                onLoad={handleImageLoad}
              />
            </motion.div>
        </div>
            {currentIndex < photos.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 text-white text-3xl bg-gray-800 p-2 rounded-full hover:bg-gray-700 opacity-50 hover:opacity-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
</svg>

              </button>
            )}
          </div>
          <div className="flex justify-center mt-4 mb-4">
            <p className="text-white text-lg">
              {currentIndex + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default WeddingPhotoSlider;
