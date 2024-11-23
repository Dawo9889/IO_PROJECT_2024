import axios from 'axios';
import { useState } from 'react';

const WeddingList = ({ weddings, setSelectedWedding, fetchWeddings }) => {
  // const [weddings, setWeddings] = useState([]);
  const [error, setError] = useState(null);

  const handleDelete = (weddingId) => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    const accessToken = authData?.accessToken;

    axios
      .delete(`${import.meta.env.VITE_API_URL}/wedding/?id=${weddingId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        console.log("Wedding deleted successfully.");
        fetchWeddings(); // Odśwież listę wesel po usunięciu
      })
      .catch((err) => {
        console.error("Error deleting wedding:", err);
      });
  };

  return (
    <div className="flex justify-start pt-6">
      <div className="h-[200px] lg:min-h-[600px] overflow-y-auto w-full p-6 bg-project-dark-bg border border-project-blue rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Weddings List</h1>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="flex flex-col gap-6">
            {weddings.map((wedding) => (
            <li
              key={wedding.id}
              className="p-4 bg-project-light-bg text-white rounded-lg shadow-md flex justify-between items-center"
            >
              <span onClick={() => setSelectedWedding(wedding.id)} className="cursor-pointer">
                {wedding.name}
              </span>
              <button 
                onClick={() => handleDelete(wedding.id)} 
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingList;
