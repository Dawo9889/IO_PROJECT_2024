import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';

const WeddingPhotoSlider = ({ weddingId, index, onClose }) => {
  const [isVertical, setIsVertical] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [bufferedPhotos, setBufferedPhotos] = useState([]);
  
  const authData = JSON.parse(localStorage.getItem("auth"));
  const accessToken = authData?.accessToken;
  
  const closeSlider = () => {
    onClose();
  };

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

  const handleImageClick = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const { data: fetchedPhotos, isLoading, isError, error } = useQuery({
    queryKey: ['weddingPhotos', weddingId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/image/path?weddingId=${weddingId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      const sortedData = response.data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      
      const photosLinks = sortedData.map((item) => item.filePath);
  
      // Pobieramy zdjęcia i konwertujemy je na BLOB
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
            return URL.createObjectURL(blob); // Tworzymy URL dla obiektu BLOB
          } catch (err) {
            console.error(`Błąd autoryzacji dla miniatury ${photo}:`, err);
            return null; // Jeśli wystąpi błąd, zwracamy null
          }
        })
      );
      return authorizedPhotos.filter((photo) => photo !== null); // Filtrowanie pustych elementów
    },
    enabled: !!weddingId, // Query będzie wykonane tylko jeśli weddingId jest dostępne
    staleTime: 1000 * 60 * 10, // Czas, po którym dane są uważane za "nieaktualne" (10 minut)
    refetchInterval: 1000 * 60 * 5, // Odświeżanie danych co 5 minut w tle
    cacheTime: 1000 * 60 * 30, // Przechowywanie danych w cache przez 30 minut
  });

  useEffect(() => {
    console.log("buforuje")
    if (!isLoading && !isError && fetchedPhotos) {
      setPhotos(fetchedPhotos);
      setLoading(false);
      // Zbuforuj zdjęcia do przodu i wstecz
      setBufferedPhotos([
        fetchedPhotos[currentIndex - 2] || null,
        fetchedPhotos[currentIndex - 1] || null,
        fetchedPhotos[currentIndex],
        fetchedPhotos[currentIndex + 1] || null,
        fetchedPhotos[currentIndex + 2] || null,
      ]);
    }
  }, [fetchedPhotos, currentIndex, isLoading, isError]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overscroll-y-none"
         onClick={closeSlider}
    >
      {loading ? 
        <div>
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
      <div className='flex flex-col'>
        <div className="max-w-4xl flex items-center m-4" onClick={handleImageClick}>
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={closeSlider}
          >
            &times;
          </button>
          
          {currentIndex > 0 && 
            <button
              onClick={goToPrevious}
              className="absolute left-4 text-white text-3xl bg-gray-800 p-2 rounded-full hover:bg-gray-700 opacity-50 hover:opacity-100"
            >
              &larr;
            </button>
          }

          <motion.img
            key={currentIndex}
            src={bufferedPhotos[2]} // Używamy zbuforowanego zdjęcia
            alt={`Photo ${currentIndex + 1}`}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`mx-auto rounded-lg ${isVertical ? "max-h-[90vh] max-w-[70vw]" : "max-w-full max-h-screen"} object-contain`}
          />

          {currentIndex < photos.length - 1 &&
            <button
              onClick={goToNext}
              className="absolute right-4 text-white text-3xl bg-gray-800 p-2 rounded-full hover:bg-gray-700 opacity-50 hover:opacity-100"
            >
              &rarr;
            </button>
          }
        </div>
        
        <div className="flex justify-center mt-4" onClick={handleImageClick}>
          <p className="text-white text-lg">
            {currentIndex + 1} / {photos.length}
          </p>
        </div>
      </div>
}
    </div>
  );
}

export default WeddingPhotoSlider;
