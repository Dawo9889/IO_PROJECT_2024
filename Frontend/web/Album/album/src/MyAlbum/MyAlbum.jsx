import HTMLFlipBook from "react-pageflip";
import React, { useState, useRef } from "react";
import {GiHamburgerMenu} from 'react-icons/gi'
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
            <h1>Page Header</h1>
            <p>{props.children}</p>
            <p>{props.number}</p>
        </div>
    );
});

function MyAlbum(props) {
    const [checkPrevPage, setCheckPrevPage] = useState(false);
    const [checkNextPage, setCheckNextPage] = useState(true);
    const [inputText, setInputElement] = useState("");
    const [text, setText] = useState("");
    const [pages, setPages] = useState([{ id: 1, content: "First page" }, { id: 2, content: "Second page" }]);
    const [bookKey, setBookKey] = useState(0); // Key to force re-render
    const flipBookRef = useRef(); // Reference to HTMLFlipBook

    const printText = () => {
        setText(inputText);
        setInputElement("");
    };

    const addPage = () => {
        const newPage = {
            id: pages.length + 1,
            content: `New page ${pages.length + 1}`
        };
        setPages([...pages, newPage]);
        setBookKey(bookKey + 1); // Change key to force re-render
    };

    const nextPage = () => {
        if (flipBookRef.current && flipBookRef.current.pageFlip) {
            const pageFlip = flipBookRef.current.pageFlip();
        const currentPageIndex = pageFlip.getCurrentPageIndex();
        const totalPages = pageFlip.getPageCount();
        console.log(currentPageIndex)
        if (currentPageIndex + 1 < totalPages) {
            pageFlip.flipNext();
            setCheckNextPage(true);
            setCheckPrevPage(true);
            if(currentPageIndex == totalPages - 3)
                {
                    console.log("elo")
                    setCheckNextPage(false);
                }
        } else {
            setCheckPrevPage(true);
            setCheckNextPage(false);
            console.log(checkNextPage);
        }
        }
    };

    const prevPage = () => {
        if (flipBookRef.current && flipBookRef.current.pageFlip) {
            const pageFlip = flipBookRef.current.pageFlip();
        const currentPageIndex = pageFlip.getCurrentPageIndex();
        console.log(currentPageIndex)
        if (currentPageIndex > 0) {
            pageFlip.flipPrev();
            setCheckPrevPage(true);
            setCheckNextPage(true);
            if(currentPageIndex == 1)
            {
                setCheckPrevPage(false);
            }
        } else {
            setCheckNextPage(true);
            setCheckPrevPage(false);
            console.log(checkPrevPage);
        }
        }
    };

    return (
        <>
            <div style={{ backgroundColor: "white", minHeight: "100vh", padding: "20px", transition: "margin 0.2s", left: "200px" }}>
                <div className="main-box">
                    <button className={checkPrevPage ? "btn-nav" : "btn-nav-disabled"} onClick={prevPage}> &larr; </button>    
                        <HTMLFlipBook
                            key={bookKey} // Key to force re-render on page addition
                            width={550}
                            height={650}
                            minWidth={315}
                            maxWidth={1000}
                            minHeight={420}
                            maxHeight={1350}
                            showCover={true}
                            flippingTime={1000}
                            style={{ margin: "0 auto" }}
                            maxShadowOpacity={0.5}
                            className="album-web"
                            ref={flipBookRef} // Set reference
                        >
                            <PageCover>Wesele //placeholder</PageCover>
                            <PageCover></PageCover>
                            {pages.map((page, index) => (
                                <Page key={page.id} number={page.id}>
                                    <hr></hr>
                                    <p contentEditable="true">{page.content}</p>
                                </Page>
                            ))}
                            <PageCover></PageCover>
                            <PageCover>Do zobaczenia na poprawinach</PageCover>
                        </HTMLFlipBook>
                    <button className={checkNextPage ? "btn-nav" : "btn-nav-disabled"} onClick={nextPage}>&rarr;</button>
                </div>
                
                <br />
                <div className="formContainer">
                    <input
                        className="form-control"
                        value={inputText}
                        onChange={(e) => setInputElement(e.target.value)}
                        type="text"
                        placeholder="Wpisz tekst do wyswietlenia"
                    />
                    <button className="btn" onClick={printText}>
                        Dodaj naglowek
                    </button>
                    <button className="btn" onClick={addPage}>
                        Dodaj stronę
                    </button>
                </div>
            </div>
        </>
    );
}

export default MyAlbum;
