import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
const PhotosSlider = ({weddingId}) => {
    const [photos, setPhotos] = useState([]);
  
    const authData = JSON.parse(localStorage.getItem("auth"));
    const accessToken = authData?.accessToken;
  
    const [isSliderOpen, setIsSliderOpen] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const openSlider = (index) => {
      setCurrentIndex(index);
      setIsSliderOpen(true);
    };
  
    const closeSlider = () => {
      setIsSliderOpen(false);
      setCurrentIndex(null);
    };
  
    const goToPrevious = () => {
      setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : photos.length - 1));
    };
  
    const goToNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex < photos.length - 1 ? prevIndex + 1 : 0));
    };

    useEffect(() => {
        const fetchPhotos = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/image/path?weddingId=${weddingId}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const photosLinks = response.data.map((item) => item.filePath);
            const authorizedPhotos = await Promise.all(
              photosLinks.map(async (photo) => {
                try {
                  const res = await axios.get(photo, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                    responseType: "arraybuffer",
                  });
                  const blob = new Blob([res.data], { type: "image/jpeg" });
                  const image = URL.createObjectURL(blob);
                  return image;
                } catch (err) {
                  console.error(`Błąd autoryzacji dla miniatury ${photo}:`, err);
                  return null; 
                }
              })
            );
            console.log(authorizedPhotos)
            setPhotos(authorizedPhotos.filter((photo) => photo !== null));
          } catch (err) {
            console.error("Błąd podczas pobierania miniatur:", err);
          }
        };
        fetchPhotos();
        console.log(photos)
      }, [weddingId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="relative max-w-4xl flex items-center">

      <button
        className="absolute top-4 right-4 text-white text-3xl"
        onClick={closeSlider}
      >
        &times;
      </button>
    {currentIndex != 0 ? 
    <button
        onClick={goToPrevious}
        className="absolute left-4 text-white text-3xl bg-gray-800 p-2 rounded-full hover:bg-gray-700"
    >
        &larr;
    </button>
    :
    <></>
    }
      <img
        src={photos[currentIndex]}
        alt={`Current ${currentIndex + 1}`}
        className="max-w-full max-h-screen rounded-lg mx-auto"
      />
  
    {currentIndex < photos.length - 1 ? 
      <button
        onClick={goToNext}
        className="absolute right-4 text-white text-3xl bg-gray-800 p-2 rounded-full hover:bg-gray-700"
      >
        &rarr;
      </button>
      :
      <></>
      }
    </div>
  </div>  
  )
}

export default PhotosSlider
