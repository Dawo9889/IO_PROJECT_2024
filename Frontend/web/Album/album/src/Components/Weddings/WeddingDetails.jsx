import { useState, useEffect } from 'react';
import axios from 'axios';
import WeddingPhotos from './WeddingPhotos';

const WeddingDetails = ({ weddingId }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);

  const authData = JSON.parse(localStorage.getItem("auth"));
  const accessToken = authData?.accessToken;

  useEffect(() => {
    if (!weddingId) return;

    setLoading(true);
    setError(null);
    axios
      .get(`${import.meta.env.VITE_API_URL}/wedding/details/?id=${weddingId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setDetails(response.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('Wedding not found (404).');
        } else {
          setError('Error fetching wedding details.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [weddingId]);

  useEffect(() => {
    if (!weddingId) return;

    setLoading(true);
    setError(null);
    axios
      .get(`${import.meta.env.VITE_API_URL}/wedding/token-qr/?id=${weddingId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
         responseType: 'arraybuffer',
      })
      .then((response) => {
        const binary = new Uint8Array(response.data);
        const binaryString = binary.reduce((data, byte) => data + String.fromCharCode(byte), '');
        const base64QrCode = btoa(binaryString);
        setQrCode(base64QrCode);
      })
      .catch((err) => {
        console.log(err)
        if (err.response?.status === 404) {
          setError('Wedding not found (404).');
        } else {
          setError('Error fetching wedding details.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [weddingId]);

  return (
    <div className="max-w-6xl mx-auto p-6 h-[700px] lg:min-h-[700px] bg-project-dark-bg rounded-lg shadow-lg mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {loading ? (
        <div className="flex items-center justify-center h-full col-span-2">
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
      ) : error ? (
        <p className="text-red-500 text-center col-span-2">{error}</p>
      ) : details ? (
        <div className="text-white col-span-2 md:col-span-1">
          <h1 className="text-3xl font-semibold mb-4">{details.name}</h1>
          <p className="mb-2 text-lg">
            <strong>Date:</strong> {details.eventDate}
          </p>
          <p className="mb-4 text-lg">
            <strong>Description:</strong> {details.description}
          </p>

          {qrCode ? (
            <div className="flex mb-4">
              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="Wedding QR Code"
                className="w-48 h-48 border-4 border-project-blue rounded-lg shadow-xl"
              />
            </div>
          ) : (
            <p className="text-center">No QR code available.</p>
          )}
        </div>
      ) : (
        <p className="text-gray-400 text-center col-span-2">
          Click a wedding to see details
        </p>
      )}

      <div className="col-span-2 md:col-span-2">
        <div className="flex justify-center items-center h-full">
          {weddingId ? 
            // <WeddingPhotos weddingId={weddingId} />
            <div></div>
          :
            <div></div>
          }
        </div>
      </div>
    </div>
  );
};

export default WeddingDetails;
