import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
import Spinner from "../Spinner/Spinner";
import WeddingPhotoSlider from "./WeddingPhotoSlider";
import useAuth from "../hooks/useAuth";

const WeddingPhotos = ({ weddingId }) => {
  const {auth} = useAuth()

  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [pageCount, setPageCount] = useState(null)
  const [pageIndex, setPageIndex] = useState(1);

  const breakpointColumnsObj = {
    default: 6,
    1200: 4,
    1024: 4,
    768: 2,
    640: 2,
    400: 1,
  };

  const openSlider = (index) => {
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

  const handlePhotoDeleted = () => {
    fetchThumbnails();
    console.log("hej")
    if(thumbnails.length == 0){
      setPageCount(pageCount - 1)
      setPageIndex(pageIndex - 1)
    }
  };
  
  const fetchWeddingInfo = async () => {
    try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/wedding/details/?id=${weddingId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        const totalPages = Math.ceil(response.data.imagesCount / 24);
        setPageCount(totalPages);

  }catch (err) {
  };
};


const fetchThumbnails = async () => {
  setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/image/path?weddingId=${weddingId}&pageNumber=${pageIndex}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        if(response.data.length == 0){
          setPageCount(pageCount - 1)
        }
        const thumbnailLinks = response.data.map((item) => item.thumbnailPath);
        const authorizedThumbnails = await Promise.all(
          thumbnailLinks.map(async (thumbnail) => {
            try {
              const res = await axios.get(thumbnail, {
                headers: {
                  Authorization: `Bearer ${auth.accessToken}`,
                },
                responseType: "arraybuffer",
              });
              const blob = new Blob([res.data], { type: "image/jpeg" });
              const image = URL.createObjectURL(blob);
              return image;
            } catch (err) {
              return null;
            }
          })
        );
        setThumbnails(
          authorizedThumbnails.filter((thumbnail) => thumbnail !== null)
        );
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchWeddingInfo()
    const interval = setInterval(() => {
      fetchWeddingInfo();
    }, 1000);
      
    return () => clearInterval(interval);
  },[weddingId])

  useEffect(() => {
    fetchThumbnails();
  }, [weddingId,pageIndex]);
  
  return (
    <div className="flex justify-start relative bg-project-dark-bg">
      {loading ? (
        <div className="w-full pt-64">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center sm:max-h-[50px] h-[50px] w-full pr-2 ">
            {pageIndex > 1 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-xl bg-project-yellow p-2 mb-4 text-black hover:bg-project-yellow hover:opacity-50 rounded-xl"
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
            {pageCount > 0 && (
              <p className="text-white font-bold mx-auto">
                {pageIndex} / {pageCount}
              </p>
            )}
            {pageIndex < pageCount && (
              <button
                onClick={goToNext}
                className="absolute right-4 text-xl bg-project-yellow p-2 mb-4 text-black hover:bg-project-yellow hover:opacity-50 rounded-xl"
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

          <div className="flex w-full h-[600px] overflow-y-scroll relative rounded-xl">
            <div className="w-full rounded-xl">
              {thumbnails.length > 0 ? (
                <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -ml-4 mr-2"
                columnClassName="pl-4 space-y-3"
              >
                {thumbnails.map((thumbnail, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden shadow-md cursor-pointer h-[300px]"
                    onClick={() => openSlider(index)}
                  >
                    <img
                      src={thumbnail}
                      alt={`Thumbnail ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover gap-3"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                ))}
              </Masonry>
              ) : (
                <div className="flex items-center justify-center w-full h-full text-center text-white text-2xl">
                  No images here
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
          onPhotoDeleted={handlePhotoDeleted}
          onClose={() => setIsSliderOpen(false)}
        />
      )}
    </div>
  );
  
};

export default WeddingPhotos;
