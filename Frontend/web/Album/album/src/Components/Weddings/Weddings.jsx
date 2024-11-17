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
        axios.get(`http://${import.meta.env.VITE_LOCALHOST_IP}:8080/api/wedding`, {
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
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h1 className="text-2xl font-bold text-center mb-6">Wedding List</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {weddings.map(wedding => (
            <div key={wedding.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="header">
                    <h2 className="text-xl font-semibold text-center mb-2">{wedding.name}</h2>
                    <p className="text-sm text-gray-500 text-center mb-2">Date: {wedding.eventDate}</p>
                    <p className="text-sm text-gray-700">{wedding.description}</p>
                </div>
            </div>
        ))}
    </div>
</div>
    );
}