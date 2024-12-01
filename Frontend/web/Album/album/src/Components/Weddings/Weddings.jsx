import { useState, useEffect } from 'react';
import WeddingList from './WeddingList';
import WeddingDetails from './WeddingDetails';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import axios from 'axios'
const Weddings = () => {
  const [selectedWedding, setSelectedWedding] = useState(null);
  const [weddings, setWeddings] = useState([]);

  const fetchWeddings = () => {
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
  };

  useEffect(() => {
    fetchWeddings(); 
  }, []);
  

  return (
    <>
      <a
        className="absolute left-3 inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg hover:bg-project-dark-bg sm:p-2 sm:mb-3 md:p-4 md:mb-4"
        href="/admin"
      >
        <ArrowLeftIcon className="w-6 h-6 text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
      </a>
      <br />
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-project-dark">
        <div className="min-h-[100px] bg-project-dark sm:col-span-2 md:col-span-1">
          <WeddingList 
            weddings={weddings} 
            setSelectedWedding={setSelectedWedding} 
            fetchWeddings={fetchWeddings} 
          />
        </div>
        <div className="bg-project-dark sm:col-span-2 md:col-span-2">
        <WeddingDetails weddingId={selectedWedding} />
        </div>
      </div>
    </>
  );
};

export default Weddings;
