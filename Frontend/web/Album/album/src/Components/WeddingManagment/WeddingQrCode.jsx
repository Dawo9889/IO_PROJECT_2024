import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import useAuth from '../hooks/useAuth';

const WeddingQRCode = ({ weddingId, onTokenUpdated  }) => {
  const {auth} = useAuth()
  
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenExpire, setTokenExpire] = useState('');

  const updateToken = () => {
    if (!tokenExpire) {
        toast.error('Please provide the token expiration time in hours.');
        return;
      }
    else if(tokenExpire < 0){
      toast.error('Please provide a positive number.');
        return;
    }
    axios
    .put(
      `${import.meta.env.VITE_API_URL}/wedding/updateToken?id=${weddingId}&hours=${tokenExpire}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          Accept: '*/*',
        },
      }
    )
    .then(() => {
      toast.success('Expiration date extended!');

      setTokenExpire('');

      if (onTokenUpdated) {
        onTokenUpdated();
      }
    })
    .catch((err) => {
      console.error('Error:', err.response?.data || err.message);
      toast.error('An error occurred while updating expiration time.');
    });
  };

  useEffect(() => {
    if (!weddingId) return;
    setQrCodeLoading(true);
    setError(null);
    axios
      .get(`${import.meta.env.VITE_API_URL}/wedding/token-qr/?id=${weddingId}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
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
        if (err.response?.status === 404) {
          setError('Wedding not found (404).');
        } else {
          setError('Error fetching QR Code.');
        }
      })
      .finally(() => {
        setQrCodeLoading(false);
      });
  }, [weddingId]);

  if (qrCodeLoading) {
    return (
      <Spinner />
    );
  }
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="w-full flex items-center justify-center h-full col-span-1 space-y-4 p-4">
      <div className="flex flex-col items-center justify-center h-full">
        {qrCode ? (
            <>
          <img
            src={`data:image/png;base64,${qrCode}`}
            alt="Wedding QR Code"
            className="w-64 h-64 border-4 border-project-blue rounded-lg shadow-xl"
          />
        <div className="w-full flex flex-col md:flex-row items-center gap-4 mt-4">
        <input
          type="number"
          id="tokenInput"
          min={0}
          value={tokenExpire}
          onChange={(e) => setTokenExpire(e.target.value)}
          placeholder="Enter hours to extend"
          className="w-full md:w-auto py-2 px-4 text-sm text-white bg-project-dark border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-project-blue focus:outline-none"
        />
        <button
          className="w-full px-6 py-2 text-sm font-medium bg-project-yellow text-black rounded-lg shadow hover:bg-yellow-400 focus:ring-2 focus:ring-offset-2 focus:ring-project-blue"
          onClick={updateToken}
        >
          Update Token
        </button>
      </div>
      </>
        ) : (
          <p className="text-gray-400 text-center"></p>
        )}
      </div>
    </div>
  );
};

export default WeddingQRCode;
