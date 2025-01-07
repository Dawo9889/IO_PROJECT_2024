import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../Spinner/Spinner'
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import 'react-lazy-load-image-component/src/effects/blur.css';

const WeddingPhotoSlider = ({ weddingId,pageCount, index,onPhotoDeleted, onClose }) => {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  
  const deletePhoto = async () => {
    const photoId = photos[currentIndex]?.id;
    if (!photoId) return;
  
    setIsDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      const photoId = photos[currentIndex].id;
  
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/image/delete?weddingId=${weddingId}&imageId=${photoId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      onPhotoDeleted(); //TODO: podczas usuwania przyciemnic ekran
      await fetchPhotos();
      if(currentIndex < photos.length){ //TODO: ogarnac mechanizm sprawdzania numeru strony oraz zdjecia, np (na 2 stronie mam 3 zdjecia) usuwam 1 zdjecie z 2 strony ale zostaje na obecnej stronie
        setCurrentIndex(currentIndex - 1)
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    } finally {
      setIsDialogOpen(false);
    }
  };
  
  const handleCancelDelete = () => {
    setIsDialogOpen(false);
  };

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
          description: photos[currentIndex].description
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

  useEffect(() => {
    fetchPhotos();
  }, [weddingId]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={closeSlider}
    >
      {loading || !currentPhoto ? (
      <Spinner />
      ) : (
        <div className="flex flex-col">
          <div className='text-white text-2xl flex justify-center w-full'>
              {currentPhoto?.description}
          </div>
          <div
            className="max-w-4xl flex items-center m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 flex flex-row items-center gap-4">
              <button
                className="text-white text-xl"
                onClick={() => setIsDialogOpen(true)}
              >
                <FontAwesomeIcon  icon={faTrashCan} />
              </button>
              <button
                className="text-white text-xl"
                onClick={closeSlider}
              >
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>
  
            {currentIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white text-3xl bg-project-blue p-2 rounded-full hover:bg-project-blue-buttons opacity-50 hover:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                  />
                </svg>
              </button>
            )}

            <div className="min-h-[250px] lg:min-h-[600px]">
              <motion.div key={currentIndex} className="flex justify-center">
                <LazyLoadImage
                  src={currentPhoto?.photoSrc}
                  placeholderSrc={currentPhoto?.thumbnailSrc}
                  effect="blur"
                  alt={`Photo ${currentIndex + 1}`}
                  className={`mx-auto rounded-lg ${
                    isVertical
                      ? 'max-h-[85vh] max-w-[70vw]'
                      : 'max-w-full max-h-screen'
                  } object-contain`}
                  onLoad={handleImageLoad}
                />
              </motion.div>
            </div>
  
            {currentIndex < photos.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 text-white text-3xl bg-project-blue p-2 rounded-full hover:bg-project-blue-buttons opacity-50 hover:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
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
  
      <ConfirmationDialog
        isOpen={isDialogOpen}
        message="Are you sure you want to delete this photo?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
  
  
};

export default WeddingPhotoSlider;
