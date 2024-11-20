import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Weddings() {
    const [weddings, setWeddings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const accessToken = authData?.accessToken;
        // console.log(authData)
        axios.get(`${import.meta.env.VITE_API_URL}/wedding`, {
            headers: {
                 Authorization: `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                setWeddings(response.data);
            })
            .catch(() => {
                setError('Error fetching weddings');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // console.log(weddings)
    if (loading) return <p>Loading weddings...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4'>
          {/* Kolumna z weselami po lewej stronie */}
          <div className="flex justify-start pl-6">
            <div className="max-h-[400px] md:max-h-[500px] lg:max-h-[600px] overflow-y-auto max-w-md p-6 bg-project-dark-bg border border-project-blue rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-white text-center mb-6">Weddings List</h1>
              <div className="flex flex-col gap-6">
                {weddings.map(wedding => (
                  <div key={wedding.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-indigo-200">
                    <div className="header">
                      <h2 className="text-xl font-semibold text-center mb-2">{wedding.name}</h2>
                      <p className="text-sm text-gray-500 text-center mb-2">Date: {wedding.eventDate}</p>
                      <p className="text-sm text-gray-700">{wedding.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      
          {/* Zmniejszenie szerokości i wysokości drugiego elementu */}
          <div className='md:col-span-2 p-6 bg-project-dark-bg rounded-lg shadow-lg'>
            <h1>elo</h1>
          </div>
        </div>
      );
      
      
}