/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import HTMLFlipBook from "react-pageflip";
import React, { useState, useRef } from "react";
import "./MyAlbum.css";

const PageCover = React.forwardRef((props, ref) => {
    return (
        <div className="cover" ref={ref} data-density="hard">
            <div>
                <h2>{props.children}</h2>
            </div>
        </div>
    );
});

const Page = React.forwardRef((props, ref) => {
    const handleDrop = (e, position) => {
        const src = e.dataTransfer.getData("text");
        props.onImageDrop(src, position, props.number); // Używamy props.number
        e.target.style.border = "none";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="page" ref={ref}>
            <h1 className="page-header">{props.header}</h1>
            <div className="image-container">
                <div
                    className="drop-zone"
                    onDrop={(e) => handleDrop(e, "imageLeft")}
                    onDragOver={handleDragOver}
                >
                    {props.imageLeft && <img src={props.imageLeft} alt="Left" className="page-image" />}
                    <span className="drop-text">Upuść zdjęcie po lewej stronie</span>
                </div>
                <div
                    className="drop-zone"
                    onDrop={(e) => handleDrop(e, "imageLeftBottom")}
                    onDragOver={handleDragOver}
                >
                    {props.imageLeftBottom && <img src={props.imageLeftBottom} alt="Left Bottom" className="page-image" />}
                    <span className="drop-text">Upuść zdjęcie poniżej po lewej stronie</span>
                </div>
            </div>
            <div className="page-number">
                {`Strona ${props.number}`}  {/* Używamy props.number */}
            </div>
        </div>
    );
});

function ImageGallery({ onDragStart }) {
    const images = ["/zdj1.jpg", "/zdj2.jpg"];

    return (
        <div className="image-gallery">
            <h3>Galeria zdjęć</h3>
            <div className="gallery-container">
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Gallery ${index + 1}`}
                        className="gallery-image"
                        draggable
                        onDragStart={(e) => onDragStart(e, src)}
                    />
                ))}
            </div>
        </div>
    );
}

function MyAlbum() {
    const [inputText, setInputText] = useState("");
    const [selectedPage, setSelectedPage] = useState(1);
    const [pages, setPages] = useState([
        { number: 1, header: "Nagłówek strony 1", imageLeft: null, imageLeftBottom: null },
        { number: 2, header: "Nagłówek strony 2", imageLeft: null, imageLeftBottom: null },
    ]);
    const [bookKey, setBookKey] = useState(0);
    const flipBookRef = useRef(null); // Reference to the HTMLFlipBook component

    const updateHeader = () => {
        setPages(pages.map(page =>
            page.number === selectedPage ? { ...page, header: inputText } : page
        ));
        setInputText("");
    };

    const addPage = () => {
        const maxNumber = Math.max(...pages.map(page => page.number), 0); // Znajdź maksymalny numer strony
        const newPage = [
            {
                number: maxNumber + 1,  // Generowanie numeru strony na podstawie największego numeru
                header: `Nagłówek strony ${maxNumber + 1}`,
                imageLeft: null,
                imageLeftBottom: null,
            },
            {
                number: maxNumber + 2,  // Kolejny numer strony
                header: `Nagłówek strony ${maxNumber + 2}`,
                imageLeft: null,
                imageLeftBottom: null,
            }
        ];
        setPages([...pages, ...newPage]);
        setBookKey(prevKey => prevKey + 1);  // Przeładowanie klucza książki, aby wymusić renderowanie
    };

    const handleImageDrop = (src, position, pageNumber) => {
        setPages(pages.map(page =>
            page.number === pageNumber ? { ...page, [position]: src } : page
        ));
    };

    const handleDragStart = (e, src) => {
        e.dataTransfer.setData("text", src);
    };

    const handleJumpToPage = (page) => {
        // Używamy page.number do przekazania numeru strony
        const pageIndex = page + 1;
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flip(pageIndex);
        }
    };

    return (
        <div style={{ backgroundColor: "LightCyan", minHeight: "100vh", padding: "20px", display: "flex" }}>
            <div className="upload-box-container">
                <ImageGallery onDragStart={handleDragStart} />
            </div>

            <div style={{ flex: 1 }}>
                <HTMLFlipBook
                    key={bookKey}
                    width={650}
                    height={750}
                    minWidth={315}
                    maxWidth={1000}
                    minHeight={420}
                    maxHeight={1350}
                    showCover={true}
                    flippingTime={1000}
                    style={{ margin: "0 auto" }}
                    maxShadowOpacity={0.5}
                    disableFlipByClick={true}
                    className="album-web"
                    ref={flipBookRef} // Using ref to get reference to the flipbook
                >
                    <PageCover>Wesele // placeholder</PageCover>
                    <PageCover></PageCover>
                    {pages.map((page) => (
                        <Page
                            key={page.number}  // Używamy page.number
                            number={page.number}  // Używamy page.number
                            header={page.header}
                            imageLeft={page.imageLeft}
                            imageLeftBottom={page.imageLeftBottom}
                            onImageDrop={handleImageDrop}
                        />
                    ))}
                    <PageCover></PageCover>
                    <PageCover>Do zobaczenia na poprawinach</PageCover>
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
                        style={{ width: "120px", marginLeft: "10px" }}
                    >
                        {pages.map((page) => (
                            <option key={page.number} value={page.number}>
                                Strona {page.number}
                            </option>
                        ))}
                    </select>
                    <button className="btn" onClick={updateHeader} style={{ marginLeft: "10px" }}>
                        Zmień nagłówek
                    </button>
                    <button className="btn" onClick={addPage} style={{ marginLeft: "10px" }}>
                        Dodaj stronę
                    </button>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <select
                        className="form-control"
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(Number(e.target.value))}
                        style={{ width: "120px", display: "inline-block", marginRight: "10px" }}
                    >
                        {pages.map((page) => (
                            <option key={page.number} value={page.number}>
                                Strona {page.number}
                            </option>
                        ))}
                    </select>
                    <button className="btn" onClick={() => handleJumpToPage(selectedPage)}>
                        Skocz do strony
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MyAlbum;
