import React, { useState, useEffect } from "react";
import axios from "axios";

const WeddingPhotos = ({ weddingId }) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [error, setError] = useState(null);

  const authData = JSON.parse(localStorage.getItem("auth"));
  const accessToken = authData?.accessToken;

  useEffect(() => {
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
    };

    fetchThumbnails();
  }, [weddingId]);


  return (
    <div className="flex justify-start pt-6">
      <div className="h-[300px] lg:min-h-[300px] overflow-y-auto w-full p-6 bg-project-dark border border-project-blue rounded-lg shadow-lg">
        {thumbnails.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {thumbnails.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
                className="w-full rounded-lg shadow-lg"
              />
            ))}
          </div>
        ) : (
          <p>Brak miniatur</p>
        )}
      </div>
    </div>
  );
  
};

export default WeddingPhotos;
