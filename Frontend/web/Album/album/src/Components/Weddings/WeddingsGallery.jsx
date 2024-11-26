import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import WeddingPhotos from './WeddingPhotos';
import { useEffect, useState } from 'react';
import axios from 'axios';

const WeddingsGallery = () => {
  const [weddings, setWeddings] = useState([]);
  const [selectedWedding, setSelectedWedding] = useState(null);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    const accessToken = authData?.accessToken;

    axios
      .get(`${import.meta.env.VITE_API_URL}/wedding`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setWeddings(response.data);
      })
      .catch((err) => {
        console.error("Error fetching weddings:", err);
      });
  }, []);

  const handleWeddingChange = (event) => {
    const selectedId = event.target.value;
    setSelectedWedding(selectedId);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-4">
        <a
          className="inline-flex items-center justify-center p-0.5 rounded-lg hover:bg-project-dark-bg"
          href="/admin"
        >
          <ArrowLeftIcon className="w-6 h-6 text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
        </a>

        <select
          className="mx-auto w-full max-w-xs p-2 text-white bg-project-dark-bg border border-project-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue focus:border-transparent"
          value={selectedWedding || ""}
          onChange={handleWeddingChange}
        >
          <option value="" disabled>
            Wybierz wesele...
          </option>
          {weddings.map((wedding) => (
            <option key={wedding.id} value={wedding.id}>
              {wedding.name}
            </option>
          ))}
        </select>
      </div>

      <div className="my-4" />

      <div className="p-4 bg-project-dark">
        <div className="min-h-[100px]">
          {selectedWedding ? (
            <WeddingPhotos weddingId={selectedWedding} />
          ) : (
            // <p className="text-white">Wybierz wesele, aby zobaczyć zdjęcia.</p>
            <p className="text-white"></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeddingsGallery;
