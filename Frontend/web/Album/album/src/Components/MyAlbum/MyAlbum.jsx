/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import HTMLFlipBook from "react-pageflip";
import React, { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import html2canvas from "html2canvas";
import "./MyAlbum.css";

//okładka przód i tył
// StartPageCover component with correct ref forwarding
const StartPageCover = React.forwardRef((props, ref) => {
    return (
        <div className="coverStart" ref={ref} data-density="hard">
            <div>
                <h2>{props.children}</h2>
            </div>
        </div>
    );
});
const EndPageCover = React.forwardRef((props, ref) => {
    return (
        <div className="coverBack" ref={ref} data-density="hard">
            <div>
                <h2>{props.children}</h2>
            </div>
        </div>
    );
});

//strony w samym albumie
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
        <div className="page" ref={ref} data-page={props.number}>
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

//galeria do której należy podpiąć bazę danych ze zdjęciami
function ImageGallery({ onDragStart }) {
    const images = ["assets/zdj1.jpg", "assets/zdj2.jpg"];

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
    const [isStaticView, setIsStaticView] = useState(false);

    const renderStaticView = () => {
        setIsStaticView(true); // Przełącz widok na statyczny
    };
    const handleBack = () => {
        setIsStaticView(false); // Powrót do widoku sprzed renderowania albumu
    };

    const saveAlbumAsHTML = async () => {
        const zip = new JSZip();
        const albumFolder = zip.folder("album");
        const imagesFolder = albumFolder.folder("zdjęcia");

        // Create the HTML structure for the album with embedded styles
        let htmlContent = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mój Album</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .album {
                width: 80%;
                margin: 50px auto;
                background-color: #ffffff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .cover {
                text-align: center;
                padding: 50px;
                background-color: #ff7f50;
                color: white;
                font-size: 2em;
                font-weight: bold;
                border-radius: 15px;
                margin-bottom: 20px;
            }
            .cover h2 {
                margin: 0;
            }
            .page {
                margin-bottom: 20px;
                padding: 20px;
                background-color: #fafafa;
                border-radius: 10px;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .page h1 {
                font-size: 1.5em;
                margin-bottom: 10px;
            }
            .images {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .page-image {
                width: 100%;
                max-width: 300px;
                margin: 10px 0;
                border-radius: 8px;
            }
            .page-number {
                font-size: 1.2em;
                font-weight: bold;
                margin-top: 10px;
            }
            .page img {
                max-width: 100%;
                height: auto;
                margin: 10px 0;
            }
            .page .drop-zone {
                border: 2px dashed #ccc;
                padding: 20px;
                margin: 10px 0;
                text-align: center;
                border-radius: 8px;
                min-height: 100px;
            }
            .page .drop-text {
                color: #aaa;
                font-size: 1em;
            }
            .form-control {
                padding: 10px;
                font-size: 1em;
                margin: 5px 0;
                border-radius: 5px;
                border: 1px solid #ccc;
            }
            .btn {
                background-color: #4CAF50;
                color: white;
                padding: 10px 15px;
                margin: 5px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            .btn:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="album">
            <div class="cover">
                <h2>Wesele/placeholder</h2>
            </div>
    `;

        // Add each page with images
        for (const page of pages) {
            htmlContent += `
            <div class="page">
                <h1>${page.header}</h1>
                <div class="images">
                    ${page.imageLeft ? `<img src="zdjęcia/${page.imageLeft.split("/").pop()}" alt="Left" class="page-image"/>` : ""}
                    ${page.imageLeftBottom ? `<img src="zdjęcia/${page.imageLeftBottom.split("/").pop()}" alt="Left Bottom" class="page-image"/>` : ""}
                </div>
                <p class="page-number">Strona ${page.number}</p>
            </div>
        `;

            // Add images to ZIP (async inside the loop)
            if (page.imageLeft) {
                const imageLeftData = await fetch(page.imageLeft).then(res => res.blob());
                imagesFolder.file(page.imageLeft.split("/").pop(), imageLeftData);
            }
            if (page.imageLeftBottom) {
                const imageLeftBottomData = await fetch(page.imageLeftBottom).then(res => res.blob());
                imagesFolder.file(page.imageLeftBottom.split("/").pop(), imageLeftBottomData);
            }
        }

        // Add the back cover at the end
        htmlContent += `
            <div class="cover">
                <h2>Do zobaczenia na poprawinach</h2>
            </div>
        </div>
    </body>
    </html>
    `;

        // Add HTML file to ZIP
        albumFolder.file("album.html", htmlContent);

        // Generate the ZIP and trigger the download
        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, "album.zip");
        });
    };

    const exportAlbumToPDF = async () => {
        const pdf = new jsPDF("p", "mm", "a4");

        // Pobranie elementów okładki i stron albumu
        const coverFront = document.querySelector(".staticCoverStart");
        const coverBack = document.querySelector(".staticCoverBack");
        const staticPages = document.querySelectorAll(".staticPage");

        if (!coverFront || !coverBack || staticPages.length === 0) {
            console.error("Nie znaleziono wszystkich wymaganych elementów (okładek i stron).");
            return;
        }

        // Funkcja pomocnicza do dodawania stron do PDF
        const addPageToPDF = async (element, isFirstPage = false) => {
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL("image/png");
            if (!isFirstPage) {
                pdf.addPage();
            }
            pdf.addImage(imgData, "PNG", 10, 10, 190, 0); // Skalowanie obrazu na stronie PDF
        };

        // Dodanie okładki przedniej
        await addPageToPDF(coverFront, true);

        // Dodanie stron statycznych
        for (let i = 0; i < staticPages.length; i++) {
            await addPageToPDF(staticPages[i]);
        }

        // Dodanie okładki tylnej
        await addPageToPDF(coverBack);

        // Zapisanie PDF
        pdf.save("album.pdf");
    };

    const exportAlbumToDocx = async () => {
        const frontCoverText = document.querySelector(".staticCoverStart")?.innerText || "Okładka przednia";
        const backCoverText = document.querySelector(".staticCoverBack")?.innerText || "Okładka tylna";

        // Zbieranie danych stron albumu
        const albumPages = pages.map((page) => ({
            header: page.header,
            images: [page.imageLeft, page.imageLeftBottom].filter(Boolean), // Filtruje tylko istniejące obrazy
        }));

        // Funkcja do konwersji obrazu na base64
        const toBase64 = (url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "Anonymous"; // Zabezpieczenie przed CORS
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL("image/jpeg")); // Zwraca base64 w formacie jpg
                };
                img.onerror = reject;
                img.src = url;
            });
        };

        // Tworzenie dokumentu DOCX
        const doc = new Document({
            sections: [
                // Okładka przednia
                {
                    properties: {
                        page: {
                            background: {
                                color: "FFFF00", // Żółty kolor
                            },
                        },
                    },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: frontCoverText,
                                    bold: true,
                                    size: 48,
                                    color: "FF7F50",
                                }),
                            ],
                            alignment: "center",
                            spacing: { after: 400 },
                        }),
                    ],
                },
                // Strony albumu
                ...await Promise.all(albumPages.map(async (page) => {
                    // Konwersja obrazów na base64
                    const imageBase64Promises = page.images.map((imageUrl) => toBase64(imageUrl));
                    const imageBase64s = await Promise.all(imageBase64Promises);

                    return {
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: page.header,
                                        bold: true,
                                        size: 36,
                                    }),
                                ],
                                alignment: "center",
                                spacing: { after: 400 },
                            }),
                            // Dodawanie obrazów
                            ...imageBase64s.map((base64Image) =>
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            data: base64Image,
                                            transformation: {
                                                width: 600,  // Możesz dostosować szerokość
                                                height: 400, // Możesz dostosować wysokość
                                            },
                                        }),
                                    ],
                                    alignment: "center",
                                })
                            ),
                        ],
                    };
                })),
                // Okładka tylna
                {
                    properties: {
                        page: {
                            background: {
                                color: "FFFF00", // Żółty kolor
                            },
                        },
                    },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: backCoverText,
                                    bold: true,
                                    size: 36,
                                    color: "FF7F50",
                                }),
                            ],
                            alignment: "center",
                            spacing: { after: 400 },
                        }),
                    ],
                },
            ],
        });

        // Generowanie i zapisywanie pliku DOCX
        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "album.docx");
        });
    };


    //zmiana nagłówka na wybranej stronie
    const updateHeader = () => {
        setPages(pages.map(page =>
            page.number === selectedPage ? { ...page, header: inputText } : page
        ));
        setInputText("");
    };

    //dodawanie kartki
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

    //przeciąganie zdjęć
    const handleImageDrop = (src, position, pageNumber) => {
        setPages(pages.map(page =>
            page.number === pageNumber ? { ...page, [position]: src } : page
        ));
    };

    const handleDragStart = (e, src) => {
        e.dataTransfer.setData("text", src);
    };

    //wybieranie strony do której bezpośrednio chcemy się dostać
    const handleJumpToPage = (page) => {
        // Używamy page.number do przekazania numeru strony
        const pageIndex = page + 1;
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flip(pageIndex);
        }
    };

    //główny "html"
    return (
        <div style={{ backgroundColor: "LightCyan", minHeight: "100vh", padding: "20px" }}>
            {!isStaticView ? ( // Jeśli dynamiczny widok
                <div style={{ display: "flex" }}>
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
                            ref={flipBookRef}
                        >
                            <StartPageCover>Wesele/placeholder</StartPageCover>
                            <EndPageCover></EndPageCover>
                            {pages.map((page) => (
                                <Page
                                    key={page.number}
                                    number={page.number}
                                    header={page.header}
                                    imageLeft={page.imageLeft}
                                    imageLeftBottom={page.imageLeftBottom}
                                    onImageDrop={handleImageDrop}
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
                            <button className="btn" onClick={updateHeader}>
                                Zmień nagłówek
                            </button>
                            <button className="btn" onClick={addPage}>
                                Dodaj stronę
                            </button>
                        </div>
                        <div className="formContainer">
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
                            <button className="btn" onClick={() => handleJumpToPage(selectedPage)}>
                                Skocz do strony
                            </button>
                            <button className="btn" onClick={saveAlbumAsHTML}>
                                Zapisz album jako HTML
                            </button>
                            <button className="btn" onClick={renderStaticView}>
                                Render
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Statyczny widok
                <div style={{ textAlign: "center" }}>
                    <button className="btn" onClick={handleBack}>Powrót do dynamicznego widoku</button>
                    <button className="btn" onClick={exportAlbumToPDF}>Eksportuj album do PDF</button>
                    <button className="btn" onClick={exportAlbumToDocx}>Eksportuj okładkę do DOCX</button>
                    <div className="staticCoverStart">
                        <h2>Wesele/placeholder</h2>
                    </div>
                    <div>
                        {pages.map((page) => (
                            <div
                                key={page.number}
                                className="staticPage"
                            >
                                <h1>{page.header}</h1>
                                <div className="staticDropZone">
                                    {page.imageLeft && (
                                        <img
                                            src={page.imageLeft}
                                            alt="Left"
                                            className="staticPageImage"
                                        />
                                    )}
                                </div>
                                <div className="staticDropZone">
                                    {page.imageLeftBottom && (
                                        <img
                                            src={page.imageLeftBottom}
                                            alt="Left Bottom"
                                            className="staticPageImage"
                                        />
                                    )}
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