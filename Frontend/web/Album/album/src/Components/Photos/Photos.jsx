import React, { useState, useEffect } from "react";
import axios from "axios";

const ThumbnailViewer = () => {
  const [thumbnails, setThumbnails] = useState([]); // Przechowuje linki do miniatur
  const [error, setError] = useState(null); // Obsługuje błędy

  // Pobranie tokena z localStorage
  const authData = JSON.parse(localStorage.getItem("auth"));
  const accessToken = authData?.accessToken;

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7017/api/image/path?weddingId=0c3d9a2a-20f4-4517-2595-08dd0c7dc087", // Endpoint zwracający JSON
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Token w nagłówku
            },
          }
        );

        // Wyciągnięcie linków do miniatur z JSON-a
        const thumbnailLinks = response.data.map((item) => item.thumbnailPath);
        // console.log(thumbnailLinks)
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
            //   console.log(blob)
              const imageUrl = URL.createObjectURL(blob);
              return imageUrl;
            } catch (err) {
              console.error(`Błąd autoryzacji dla miniatury ${thumbnail}:`, err);
              return null; 
            }
          })
        );
        // console.log(authorizedThumbnails)

        setThumbnails(authorizedThumbnails.filter((thumbnail) => thumbnail !== null));
      } catch (err) {
        console.error("Błąd podczas pobierania miniatur:", err);
        setError("Nie udało się pobrać miniatur.");
      }
    };

    fetchThumbnails();
  }, []);


  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
        PHOTOS
      {error && <p style={{ color: "red" }}>{error}</p>}
      {thumbnails.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
          {thumbnails.map((thumbnail, index) => (
            <img
              key={index}
              src={thumbnail} // Używamy URL-a do miniatury
              alt={`Thumbnail ${index + 1}`}
              style={{ maxWidth: "200px", borderRadius: "8px" }}
            />
          ))}
        </div>
      ) : (
        <p>Ładowanie miniatur...</p>
      )}
    </div>
  );
};

export default ThumbnailViewer;
