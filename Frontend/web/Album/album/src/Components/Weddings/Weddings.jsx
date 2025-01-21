import { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import axios from 'axios'
import WeddingList from '../WeddingManagment/WeddingList';
import WeddingDetails from '../WeddingManagment/WeddingDetails';
import useAuth from '../hooks/useAuth';

const Weddings = () => {
  const {auth} = useAuth()

  const [selectedWedding, setSelectedWedding] = useState(null);
  const [weddings, setWeddings] = useState([]);

  const fetchWeddings = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/wedding`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        setWeddings(response.data);
      })
      .catch((err) => {
        console.error("Error fetching weddings:", err);
      });
  };

  const refreshWeddings = () => {
    fetchWeddings(); 
  }
  const onDeleteWedding = () => {
    setSelectedWedding(null); 
    fetchWeddings();
  }

  useEffect(() => {
    fetchWeddings(); 
  }, []);
  
  return (
    <div>
      <div className='pb-6'>
        <a
          className="absolute left-3 inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg hover:bg-project-dark-bg sm:p-2 sm:mb-3 md:p-2 md:mb-4"
          href="/admin"
        >
          <ArrowLeftIcon className="w-6 h-6 text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-project-dark">
        <div className="min-h-[100px] bg-project-dark sm:col-span-2 md:col-span-1">
          <WeddingList 
            weddings={weddings} 
            setSelectedWedding={setSelectedWedding} 
            fetchWeddings={fetchWeddings}
            onDeleteWedding={onDeleteWedding} 
          />
        </div>
        <div className="bg-project-dark sm:col-span-2 md:col-span-2 ">
        <WeddingDetails 
          weddingId={selectedWedding}
          onUpdate={refreshWeddings} />
        </div>
      </div>
    </div>
  );
};

export default Weddings;
