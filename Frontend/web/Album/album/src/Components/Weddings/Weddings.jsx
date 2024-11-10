import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Weddings() {
    const [weddings, setWeddings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);

        axios.get('https://localhost:7017/api/wedding')
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

    if (loading) return <p>Loading weddings...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Wedding List</h1>
            <ul className='row'>
                <div className="column">
                    {weddings.map(wedding => (
                        <li key={wedding.id}>
                            <div className='header'>
                                <h2>{wedding.name}</h2>
                                <p>Date: {wedding.eventDate}</p>
                                <p>{wedding.description}</p>
                            </div>
                        </li>
                    ))}
                </div>
            </ul>
        </div>
    );
}
