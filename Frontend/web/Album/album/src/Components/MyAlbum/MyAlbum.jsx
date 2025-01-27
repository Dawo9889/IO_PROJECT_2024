import HTMLFlipBook from "react-pageflip";
import { useState, useRef, useEffect } from "react";
import "./MyAlbum.css";
import StartPageCover from "./StartPageCover";
import EndPageCover from "./EndPageCover";
import ImageGallery from "./ImageGallery";
import { exportAlbumToPDF, exportAlbumToDocx } from "./exportUtils";
import Page from "./Page"
import { updateHeader, updateLayout, addPage, handleImageDrop, handleJumpToPage, handleWeddingSelect } from './AlbumCustomize';

function MyAlbum() {

    //functions and consts that cannot be moved
    const [inputText, setInputText] = useState("");
    const [selectedPage, setSelectedPage] = useState(1);
    const [selectedWedding, setSelectedWedding] = useState(() => {
        return localStorage.getItem("selectedWedding") || "";
    });
    const [selectedWeddingName, setSelectedWeddingName] = useState(() => {
        return localStorage.getItem("selectedWeddingName") || "";
    });

    // Odczytaj z Local Storage przy starcie
    useEffect(() => {
        const storedWedding = localStorage.getItem("selectedWedding");
        const storedWeddingName = localStorage.getItem("selectedWeddingName");

        if (storedWedding) setSelectedWedding(storedWedding);
        if (storedWeddingName) setSelectedWeddingName(storedWeddingName);
    }, []);

    // Zapisuj do Local Storage przy każdej zmianie
    useEffect(() => {
        if (selectedWedding) {
            localStorage.setItem("selectedWedding", selectedWedding);
            localStorage.setItem("selectedWeddingName", selectedWeddingName);
        }
    }, [selectedWedding, selectedWeddingName]);

    const [pages, setPages] = useState([
        { number: 1, header: "Main description 1", images: [], layout: "default" },
        { number: 2, header: "Main description 2", images: [], layout: "default" },
    ]);

    const [bookKey, setBookKey] = useState(0);
    const flipBookRef = useRef(null);
    const [isStaticView, setIsStaticView] = useState(false);

    const [bookDimensions, setBookDimensions] = useState({ width: 300, height: 500 });

    useEffect(() => {
        // Funkcja do obliczania wymiarów książki jako procentów ekranu
        const calculateBookDimensions = () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            const width = Math.floor((screenWidth * 0.37)); // np. 30% szerokości ekranu
            const height = Math.floor((screenHeight * 0.55)); // np. 50% wysokości ekranu

            setBookDimensions({ width, height });
        };

        // Wywołanie funkcji na początku i nasłuchiwanie zmian rozmiaru okna
        calculateBookDimensions();
        window.addEventListener("resize", calculateBookDimensions);

        return () => {
            window.removeEventListener("resize", calculateBookDimensions);
        };
    }, []);

    const renderStaticView = () => {
        setIsStaticView(true);
    };
    const handleBack = () => {
        setIsStaticView(false);
    };

    const handleExportToPDF = async () => {
        const coverFront = document.querySelector(".staticCoverStart");
        const coverBack = document.querySelector(".staticCoverBack");
        const staticPages = document.querySelectorAll(".staticPage");
        await exportAlbumToPDF(coverFront, coverBack, staticPages);
    };

    const handleDragStart = (e, src) => {
        e.dataTransfer.setData("text", src);
    };

    return (
        <div style={{ backgroundColor: "#20211A", minHeight: "100vh", padding: "20px" }}>
            {!isStaticView ? (
                <div style={{ display: "flex" }}>
                    <div className="upload-box-container">
                        <ImageGallery
                            onDragStart={handleDragStart}
                            onWeddingSelect={(weddingId, weddingName) =>
                                handleWeddingSelect(weddingId, weddingName, setSelectedWedding, setSelectedWeddingName, setPages)
                            }
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <HTMLFlipBook
                            key={bookKey}
                            height={bookDimensions.width}
                            width={bookDimensions.height}
                            showCover={true}
                            flippingTime={1000}
                            style={{ margin: "0 auto" }}
                            maxShadowOpacity={0.5}
                            disableFlipByClick={true}
                            className="album-web"
                            ref={flipBookRef}
                            onFlip={(e) => {
                                const currentPage = e.data;
                                setSelectedPage(currentPage);
                            }}
                        >
                            <StartPageCover> {selectedWeddingName ? `Photo album: ${selectedWeddingName}` : "Choose Wedding"} </StartPageCover>
                            <EndPageCover></EndPageCover>
                            {pages.map((page) => (
                                <Page
                                    key={page.number}
                                    number={page.number}
                                    header={page.header}
                                    images={page.images}
                                    layout={page.layout}
                                    onImageDrop={(src, number, layout, dropIndex, author, description) =>
                                        handleImageDrop(pages, setPages, src, number, layout, dropIndex, author, description)
                                    }
                                />
                            ))}
                            <EndPageCover></EndPageCover>
                            <EndPageCover>Thanks for coming</EndPageCover>
                        </HTMLFlipBook>
                        <br />
                        <div className="formContainer">
                            <input
                                className="form-control"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                type="text"
                                placeholder="New main description"
                            />
                            <select
                                className="form-control"
                                value={selectedPage}
                                onChange={(e) => setSelectedPage(Number(e.target.value))}
                            >
                                {pages.map((page) => (
                                    <option key={page.number} value={page.number}>
                                        Page {page.number}
                                    </option>
                                ))}
                            </select>
                            <button className="btn" onClick={() => updateHeader(pages, setPages, selectedPage, inputText, setInputText)}>
                                Change main description
                            </button>
                            <button className="btn" onClick={() => addPage(pages, setPages, setBookKey)}>
                                Add Page
                            </button>
                        </div>
                        <div className="formContainer">
                            <button className="btn" onClick={() => handleJumpToPage(selectedPage, flipBookRef)}>
                                Go to page
                            </button>
                            <select
                                className="form-control"
                                onChange={(e) => updateLayout(pages, setPages, selectedPage, e.target.value)}
                            >
                                <option value="default">One photo</option>
                                <option value="vertical">Two photos (horizontal)</option>
                                <option value="horizontal">Two photos (vetical)</option>
                                <option value="grid-2x2">Grid 2x2</option>
                            </select>
                            <button className="btn" onClick={renderStaticView}>
                                Render static view
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                    <div style={{ textAlign: "center" }}>
                    <button className="btn" onClick={handleBack}>Dynamic view</button>
                    <button className="btn" onClick={handleExportToPDF}>Export to PDF</button>
                    <button className="btn" onClick={() => exportAlbumToDocx(pages)}>Export to DOCX</button>
                        <div className="staticCoverStart"
                            style={{
                            height: bookDimensions.width,
                                width: bookDimensions.height
                            }}
                        >
                            <h2>Photo album: {selectedWeddingName}</h2>
                    </div>
                    <div>
                        {pages.map((page) => (
                            <div
                                key={page.number}
                                className={`staticPage ${page.layout}`}
                                style={{
                                    height: bookDimensions.width,
                                    width: bookDimensions.height
                                }}
                            >
                                <h1>{page.header}</h1>
                                <div className="staticDropZone">
                                    {page.images.map((image, index) => (
                                        <div key={index} className="imageWithInfo">
                                            <img
                                                src={image.src}
                                                alt={`Image on page ${page.number}`}
                                                className={`staticPageImage ${page.layout}`}
                                            />
                                            <div className="imageDetails">
                                                <p className="author">{"Author: " + image.author}</p>
                                                <p className="author">{"Descr: "+image.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                        <div className="staticCoverBack"
                            style={{
                                height: bookDimensions.width,
                                width: bookDimensions.height
                            }}
                        >
                        <h2>Thanks for coming</h2>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyAlbum;