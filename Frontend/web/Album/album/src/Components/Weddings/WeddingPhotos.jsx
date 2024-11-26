import React, { useState, useEffect } from "react";
import WeddingPhotoSlider from "./WeddingPhotoSlider";
import axios from "axios";

const WeddingPhotos = ({ weddingId }) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(false);

  const authData = JSON.parse(localStorage.getItem("auth"));
  const accessToken = authData?.accessToken;

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const openSlider = (index) => {
    setCurrentIndex(index);
    setIsSliderOpen(true);
  };

  useEffect(() => {
    setLoading(true)
    const fetchThumbnails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/image/path?weddingId=${weddingId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const thumbnailLinks = response.data.map((item) => item.thumbnailPath);
        const authorizedThumbnails = await Promise.all(
          thumbnailLinks.map(async (thumbnail) => {
            try {
              const res = await axios.get(thumbnail, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
                responseType: "arraybuffer",
              });
              const blob = new Blob([res.data], { type: "image/jpeg" });
              const imageUrl = URL.createObjectURL(blob);
              return imageUrl;
            } catch (err) {
              console.error(`Błąd autoryzacji dla miniatury ${thumbnail}:`, err);
              return null; 
            }
          })
        );
        setThumbnails(authorizedThumbnails.filter((thumbnail) => thumbnail !== null));
      } catch (err) {
        console.error("Błąd podczas pobierania miniatur:", err);
      }
      finally {
        setLoading(false)
      }
    };

    fetchThumbnails();
  }, [weddingId]);


  return (
    <div className="flex justify-start pt-6">
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
      <div className="h-[300px] lg:min-h-[700px] overflow-y-auto w-full p-6 bg-project-dark border border-project-blue rounded-lg shadow-lg">
        {thumbnails.length > 0 ? (
          <div className="grid grid-cols-6 gap-3">
            {thumbnails.map((thumbnail, index) => (
            <div
            key={index}
            className="w-full h-40 lg:h-60 rounded-lg overflow-hidden shadow-lg cursor-pointer"
            onClick={() => openSlider(index)}
            >
            <img
              src={thumbnail}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-contain transition-opacity rounded-lg shadow-lg duration-200 hover:opacity-50"
            />
            </div>
            ))}
          </div>
        ) : (
          <p>Brak miniatur</p>
        )}
      </div> }
      
      {isSliderOpen &&
        <WeddingPhotoSlider 
            weddingId={weddingId} 
            index={currentIndex} 
            onClose={() => setIsSliderOpen(false)}/>
      }
    </div>
  );
};

export default WeddingPhotos;
