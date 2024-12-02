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
  const [pageCount, setPageCount] = useState(null)
  const [pageIndex, setPageIndex] = useState(1);

  const openSlider = (index) => {
    console.log("index "+index)
    setCurrentIndex(index);
    setIsSliderOpen(true);
  };

  const goToPrevious = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (pageIndex < pageCount) {
      setPageIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchWeddingInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/wedding/details/?id=${weddingId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("image count " + response.data.imagesCount)
        const totalPages = Math.ceil(response.data.imagesCount / 24);
        console.log(totalPages)
        setPageCount(totalPages);

        // const pageIndex = response.data.imagesCount % 20 === 0 ? 20 : response.data.imagesCount % 20;
        // setPageIndex(pageIndex);
  }catch (err) {
    // console.error("Błąd podczas pobierania miniatur:", err);
  };
};
fetchWeddingInfo()
},[weddingId])

  useEffect(() => {
    setLoading(true);
    console.log(pageIndex)
    const fetchThumbnails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/image/path?weddingId=${weddingId}&pageNumber=${pageIndex}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
  
        const sortedData = response.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
  
        const thumbnailLinks = sortedData.map((item) => item.thumbnailPath);
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
              const image = URL.createObjectURL(blob);
              return image;
            } catch (err) {
              // console.error(`Błąd autoryzacji dla miniatury ${thumbnail}:`, err);
              return null;
            }
          })
        );
  
        setThumbnails(
          authorizedThumbnails.filter((thumbnail) => thumbnail !== null)
        );
      } catch (err) {
        // console.error("Błąd podczas pobierania miniatur:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchThumbnails();
  }, [weddingId,pageIndex]);
  
  return (
    <div className="flex justify-start relative"> {/* Dodano relative dla kontenera zdjęć */}
      {loading ? (
        <div className="flex justify-center items-center h-1/2 w-full">
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
        <div className="flex justify-start flex-col w-full"> 
            <div className="flex justify-between items-center min-h-[50px] w-full">
    {pageIndex > 1 && (
      <button
        onClick={goToPrevious}
        className="absolute left-4 text-xl bg-project-yellow p-2 text-black hover:bg-project-yellow hover:opacity-50 rounded-xl"
      >
        Previous Page
      </button>
    )}
    <p className="text-white mx-auto">{pageIndex} / {pageCount}</p>
    {pageIndex < pageCount && (
      <button
        onClick={goToNext}
        className="absolute right-4 text-xl bg-project-yellow p-2 text-black hover:bg-bg-project-yellow hover:opacity-50 rounded-xl"
      >
        Next Page
      </button>
    )}
  </div>
          <div className="flex w-full relative">
          <div className="h-[400px] lg:min-h-[600px] w-full">
            {thumbnails.length > 0 ? (
              <div className="grid grid-cols-6 gap-3">
                {thumbnails.map((thumbnail, photoIndex) => (
                  <div
                    key={photoIndex}
                    className="w-full h-40 lg:h-60 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                    onClick={() => openSlider(photoIndex)}
                  >
                    <img
                      src={thumbnail}
                      alt={`Thumbnail ${photoIndex + 1}`}
                      className="w-full h-full object-contain transition-opacity rounded-lg shadow-lg duration-200 hover:opacity-50"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-center text-white text-2xl">
                Brak miniatur
              </div>
            )}
          </div>
          </div>
        </div>
      )}
  
      {isSliderOpen && (
        <WeddingPhotoSlider
          weddingId={weddingId}
          pageCount={pageCount}
          index={currentIndex + (pageIndex - 1) * 24}
          onClose={() => setIsSliderOpen(false)}
        />
      )}
    </div>
  );
  
};

export default WeddingPhotos;
