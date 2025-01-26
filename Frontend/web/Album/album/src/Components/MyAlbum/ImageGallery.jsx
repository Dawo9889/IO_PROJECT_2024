/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import Gallery from "./Gallery";

function ImageGallery({ onWeddingSelect }) {

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
        const selectedName = weddings.find((wedding) => wedding.id === selectedId)?.name;

        setSelectedWedding(selectedId);

        if (onWeddingSelect) {
            onWeddingSelect(selectedId, selectedName);
        }
    };

    return (
        <div className="image-gallery">
            <div className="flex items-center justify-between px-4">
                <select
                    className="mx-auto w-full max-w-xs p-2 text-white bg-project-dark-bg border border-project-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue focus:border-transparent"
                    value={selectedWedding || ""}
                    onChange={handleWeddingChange}
                >
                    <option value="" disabled>
                        Select Wedding...
                    </option>
                    {weddings.map((wedding) => (
                        <option key={wedding.id} value={wedding.id}>
                            {wedding.name}
                        </option>
                    ))}
                </select>
            </div>
            <h3>Galeria zdjęć</h3>
            <div className="gallery-container">
                {selectedWedding ? (
                    <Gallery weddingId={selectedWedding} />
                ) : (
                    <p className="text-white"></p>
                )}
            </div>
        </div>
    );
}

export default ImageGallery;
