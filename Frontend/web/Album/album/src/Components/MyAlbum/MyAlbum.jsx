import HTMLFlipBook from "react-pageflip";
import { useState, useRef, useEffect } from "react";
import "./MyAlbum.css";
import StartPageCover from "./StartPageCover";
import EndPageCover from "./EndPageCover";
import ImageGallery from "./ImageGallery";
import { saveAlbumAsHTML, exportAlbumToPDF, exportAlbumToDocx } from "./exportUtils";
import Page from "./Page"
import { updateHeader, updateLayout, addPage, handleImageDrop, handleJumpToPage, handleWeddingSelect } from './AlbumCustomize';

function MyAlbum() {

    //functions and consts that cannot be moved
    const [inputText, setInputText] = useState("");
    const [selectedPage, setSelectedPage] = useState(1);
    const [selectedWeddingName, setSelectedWeddingName] = useState(null);

    const [pages, setPages] = useState([
        { number: 1, header: "Nagłówek strony 1", images: [], layout: "default" },
        { number: 2, header: "Nagłówek strony 2", images: [], layout: "default" },
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

            const width = Math.floor((screenWidth * 0.3)); // np. 30% szerokości ekranu
            const height = Math.floor((screenHeight * 0.5)); // np. 50% wysokości ekranu

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
                        <ImageGallery onDragStart={handleDragStart} onWeddingSelect={(weddingId, weddingName) =>
                            handleWeddingSelect(weddingId, weddingName, setSelectedWeddingName, setPages)
                        } />
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
                            <StartPageCover> {selectedWeddingName ? `Album: ${selectedWeddingName}` : "Wybierz wesele"} </StartPageCover>
                            <EndPageCover></EndPageCover>
                            {pages.map((page) => (
                                <Page
                                    key={page.number}
                                    number={page.number}
                                    header={page.header}
                                    images={page.images}
                                    layout={page.layout}
                                    onImageDrop={(src, number, layout, dropIndex) =>
                                        handleImageDrop(pages, setPages, src, number, layout, dropIndex)
                                    }
                                />
                            ))}
                            <EndPageCover></EndPageCover>
                            <EndPageCover>Do zobaczenia na poprawinach</EndPageCover>
                        </HTMLFlipBook>
                        <br />
                        <div className="formContainer">
                            <input
                                className="form-control"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                type="text"
                                placeholder="Nowy nagłówek strony"
                            />
                            <select
                                className="form-control"
                                value={selectedPage}
                                onChange={(e) => setSelectedPage(Number(e.target.value))}
                            >
                                {pages.map((page) => (
                                    <option key={page.number} value={page.number}>
                                        Strona {page.number}
                                    </option>
                                ))}
                            </select>
                            <button className="btn" onClick={() => updateHeader(pages, setPages, selectedPage, inputText, setInputText)}>
                                Zmień nagłówek
                            </button>
                            <button className="btn" onClick={() => addPage(pages, setPages, setBookKey)}>
                                Dodaj Kartkę
                            </button>
                        </div>
                        <div className="formContainer">
                            <button className="btn" onClick={() => handleJumpToPage(selectedPage, flipBookRef)}>
                                Skocz do strony
                            </button>
                            <select
                                className="form-control"
                                onChange={(e) => updateLayout(pages, setPages, selectedPage, e.target.value)}
                            >
                                <option value="default">Jedno zdjęcie</option>
                                <option value="vertical">Dwa zdjęcia (pionowo)</option>
                                <option value="horizontal">Dwa zdjęcia (poziomo)</option>
                                <option value="grid-2x2">Siatka 2x2</option>
                            </select>
                            <button className="btn" onClick={() => saveAlbumAsHTML(pages)}>
                                Zapisz album jako HTML
                            </button>
                            <button className="btn" onClick={renderStaticView}>
                                Render
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: "center" }}>
                    <button className="btn" onClick={handleBack}>Powrót do dynamicznego widoku</button>
                    <button className="btn" onClick={handleExportToPDF}>Eksportuj album do PDF</button>
                    <button className="btn" onClick={() => exportAlbumToDocx(pages)}>Eksportuj okładkę do DOCX</button>
                    <div className="staticCoverStart">
                            <h2>Album: {selectedWeddingName}</h2>
                    </div>
                    <div>
                        {pages.map((page) => (
                            <div
                                key={page.number}
                                className={`staticPage ${page.layout}`}
                            >
                                <h1>{page.header}</h1>
                                <div className="staticDropZone">
                                    {page.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.src}
                                            alt="Dynamic"
                                            className={`staticPageImage ${page.layout}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="staticCoverBack">
                        <h2>Do zobaczenia na poprawinach</h2>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyAlbum;