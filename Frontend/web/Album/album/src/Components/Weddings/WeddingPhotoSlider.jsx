import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
const WeddingPhotoSlider = ({weddingId, index, onClose}) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);

    const authData = JSON.parse(localStorage.getItem("auth"));
    const accessToken = authData?.accessToken;
  
    // const [isSliderOpen, setIsSliderOpen] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(index);
  
    const closeSlider = () => {
        onClose();
    };
  
    const goToPrevious = () => {
      setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : photos.length - 1));
    };
  
    const goToNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex < photos.length - 1 ? prevIndex + 1 : 0));
    };

    useEffect(() => {
        setLoading(true)
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
          finally {
            setLoading(false)
          }
        };
        fetchPhotos();
        console.log(photos)
      }, [weddingId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    {loading ? 
      <div >
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
      :
    <div className="relative max-w-4xl flex items-center m-4">

      <button
        className="absolute top-4 right-4 text-white text-3xl"
        onClick={closeSlider}
      >
        &times;
      </button>
    {currentIndex != 0 ? 
    <button
        onClick={goToPrevious}
        className="absolute left-4 text-white text-3xl bg-gray-800 p-2 rounded-full hover:bg-gray-700 hover:opacity-50"
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
        className="absolute right-4 text-white text-3xl bg-gray-800 p-2 rounded-full hover:bg-gray-700 hover:opacity-50"
      >
        &rarr;
      </button>
      :
      <></>
      }
    </div> }
  </div>  
  )
}

export default WeddingPhotoSlider
