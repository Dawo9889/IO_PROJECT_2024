import axios from 'axios';
import { useState, useEffect } from 'react';

const WeddingList = ({ setSelectedWedding }) => {
  const [weddings, setWeddings] = useState([]);
  const [error, setError] = useState(null);

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
      .catch(() => {
        setError('Error fetching weddings list');
      });
  }, []);

  return (
    <div className="flex justify-start pt-6">
      <div className="h-[200px] lg:min-h-[600px] overflow-y-auto w-full p-6 bg-project-dark-bg border border-project-blue rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Weddings List</h1>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="flex flex-col gap-6">
            {weddings.map((wedding) => (
              <div
                key={wedding.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-project-blue cursor-pointer"
                onClick={() => setSelectedWedding(wedding.id)}
              >
                <div className="header">
                  <h2 className="text-xl font-semibold text-center mb-2">{wedding.name}</h2>
                  <p className="text-sm text-gray-500 text-center mb-2">Date: {wedding.eventDate}</p>
                  <p className="text-sm text-gray-700">{wedding.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingList;
