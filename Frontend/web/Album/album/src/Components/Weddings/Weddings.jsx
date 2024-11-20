import { useState } from 'react';
import WeddingList from './WeddingList';
import WeddingDetails from './WeddingDetails';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
const Weddings = () => {
  const [selectedWedding, setSelectedWedding] = useState(null);

  return (
    <>
    <a 
        className="absolute left-3 inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg hover:bg-project-dark-bg sm:p-2 sm:mb-3 md:p-4 md:mb-4" 
        href="/admin"
      >
      <ArrowLeftIcon className="w-6 h-6 text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
      </a> <br /> <br />
    <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      

      <WeddingList setSelectedWedding={setSelectedWedding} />

      <WeddingDetails wedding={selectedWedding} />
    </div>
    </>
  );
};

export default Weddings;
