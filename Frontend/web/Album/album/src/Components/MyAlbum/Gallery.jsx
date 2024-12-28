import axios from "axios";
import { useState, useEffect } from "react";

const Gallery = ({ weddingId }) => {
    const [thumbnails, setThumbnails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState(null);
    const [pageIndex, setPageIndex] = useState(1);

    const authData = JSON.parse(localStorage.getItem("auth"));
    const accessToken = authData?.accessToken;
    const goToPrevious = () => {
        if (pageIndex > 1) {
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
                const totalPages = Math.ceil(response.data.imagesCount / 24);
                setPageCount(totalPages);
            } catch (err) {
                console.error("Error fetching wedding details:", err);
            }
        };
        fetchWeddingInfo();
    }, [weddingId]);

    useEffect(() => {
        setLoading(true);
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
                            return URL.createObjectURL(blob);
                        } catch (err) {
                            console.error(`Authorization error for thumbnail ${thumbnail}:`, err);
                            return null;
                        }
                    })
                );

                setThumbnails(
                    authorizedThumbnails.filter((thumbnail) => thumbnail !== null)
                );
            } catch (err) {
                console.error("Error fetching thumbnails:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchThumbnails();
    }, [weddingId, pageIndex]);

    return (
        <div className="flex justify-start relative">
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
                        <p className="text-white mx-auto">
                            {pageIndex} / {pageCount}
                        </p>
                        {pageIndex < pageCount && (
                            <button
                                onClick={goToNext}
                                className="absolute right-4 text-xl bg-project-yellow p-2 text-black hover:bg-project-yellow hover:opacity-50 rounded-xl"
                            >
                                Next Page
                            </button>
                        )}
                    </div>
                    <div className="flex w-full relative overflow-y-auto">
                        <div className="h-[400px] lg:min-h-[600px] w-full">
                            {thumbnails.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {thumbnails.map((thumbnail, photoIndex) => (
                                        <div
                                            key={photoIndex}
                                            className="w-full h-40 lg:h-60 rounded-lg overflow-hidden shadow-lg"
                                        >
                                            <img
                                                src={thumbnail}
                                                alt={`Thumbnail ${photoIndex + 1}`}
                                                className="w-[250px] h-full object-contain transition-opacity rounded-lg shadow-lg duration-200"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-center text-white text-2xl">
                                    No thumbnails available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;