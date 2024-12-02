import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

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
        toast.success('Wedding delete successfully!');
        fetchWeddings();
      })
      .catch((err) => {
        console.error("Error deleting wedding:", err);
      });
  };

  return (
    <div className="flex justify-start pt-6">
      <div className="h-[200px] lg:min-h-[700px] overflow-y-auto w-full p-6 bg-project-dark-bg border border-project-blue rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Weddings List</h1>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="flex flex-col gap-6">
            {weddings.map((wedding) => (
              <div key={wedding.id} className="flex items-center gap-4">
                <ul
                  onClick={() => setSelectedWedding(wedding.id)}
                  className="flex-1 border-4 border-project-blue p-4 bg-white text-black rounded-lg shadow-md font-bold cursor-pointer"
                >
                  {wedding.name}
                </ul>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(wedding.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );  
};

export default WeddingList;
