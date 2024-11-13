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
    return (
        <div className="page" ref={ref}>
            <h1 className="page-header">{props.header}</h1>
            <div className="image-container">
                {props.imageLeft && <img src={props.imageLeft} alt="Left" className="page-image" />}
                {props.imageLeftBottom && <img src={props.imageLeftBottom} alt="Left Bottom" className="page-image" />}
            </div>
            <div className="page-number">
                {`Strona ${props.number}`}
            </div>
        </div>
    );
});

function ImageGallery({ onDragStart }) {
    const images = [
        "/assets/zdj1.png",
        "/assets/zdj2.png",
    ];

    return (
        <div className="image-gallery">
            <h3>Galeria zdj��</h3>
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
    const [imagePage, setImagePage] = useState(1);
    const [pages, setPages] = useState([
        { id: 1, header: "Nag��wek strony 1", imageLeft: null, imageLeftBottom: null },
        { id: 2, header: "Nag��wek strony 2", imageLeft: null, imageLeftBottom: null },
    ]);
    const [bookKey, setBookKey] = useState(0);

    const updateHeader = () => {
        setPages(pages.map(page =>
            page.id === selectedPage ? { ...page, header: inputText } : page
        ));
        setInputText("");
    };

    const addPage = () => {
        const newPage = {
            id: pages.length + 1,
            header: `Nag��wek strony ${pages.length + 1}`,
            imageLeft: null,
            imageLeftBottom: null,
        };
        setPages([...pages, newPage]);
        setBookKey(bookKey + 1);
    };

    const handleDrop = (e, position) => {
        const src = e.dataTransfer.getData("text");
        setPages(pages.map(page =>
            page.id === imagePage ? { ...page, [position]: src } : page
        ));
    };

    const handleDragStart = (e, src) => {
        e.dataTransfer.setData("text", src);
    };

    return (
        <div style={{ backgroundColor: "LightCyan", minHeight: "100vh", padding: "20px", display: "flex" }}>
            <div className="upload-box-container">
                <div
                    className="upload-box"
                    onDrop={(e) => handleDrop(e, "imageLeft")}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <span className="upload-text">Dodaj zdj�cie po lewej stronie</span>
                </div>
                <div
                    className="upload-box"
                    onDrop={(e) => handleDrop(e, "imageLeftBottom")}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <span className="upload-text">Dodaj zdj�cie poni�ej po lewej stronie</span>
                </div>

                <div className="page-select">
                    <label>Wybierz stron� do dodania zdj�cia:</label>
                    <input
                        type="number"
                        min="1"
                        max={pages.length}
                        value={imagePage}
                        onChange={(e) => setImagePage(Number(e.target.value))}
                    />
                </div>

                {/* Gallery with drag-and-drop functionality */}
                <ImageGallery onDragStart={handleDragStart} />
            </div>

            <div style={{ flex: 1 }}>
                <HTMLFlipBook
                    key={bookKey}
                    width={550}
                    height={650}
                    minWidth={315}
                    maxWidth={1000}
                    minHeight={420}
                    maxHeight={1350}
                    showCover={true}
                    flippingTime={1000}
                    className="album-web"
                >
                    <PageCover>Wesele //placeholder</PageCover>
                    <PageCover></PageCover>
                    {pages.map((page) => (
                        <Page
                            key={page.id}
                            number={page.id}
                            header={page.header}
                            imageLeft={page.imageLeft}
                            imageLeftBottom={page.imageLeftBottom}
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
                        placeholder="Nowy nag��wek strony"
                    />
                    <input
                        className="form-control"
                        type="number"
                        min="1"
                        max={pages.length}
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(Number(e.target.value))}
                        placeholder="Numer strony"
                        style={{ width: "100px", marginLeft: "10px" }}
                    />
                    <button className="btn" onClick={updateHeader} style={{ marginLeft: "10px" }}>
                        Zmie� nag��wek
                    </button>
                    <button className="btn" onClick={addPage} style={{ marginTop: "10px" }}>
                        Dodaj stron�
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MyAlbum;