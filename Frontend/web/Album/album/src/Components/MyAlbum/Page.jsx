/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from "react";

const Page = React.forwardRef((props, ref) => {

    const handleDrop = (e, index) => {
        e.preventDefault();
        const src = e.dataTransfer.getData("text");
        const layout = e.dataTransfer.getData("layout") || "default";
        const author = e.dataTransfer.getData("author") || "no author";
        const description = e.dataTransfer.getData("description") || "no description";
        props.onImageDrop(src, props.number, layout, index, author, description);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className={`page ${props.layout}`} ref={ref} data-page={props.number}>
            <h1 className="page-header">{props.header}</h1>
            <div className="image-container">
                {props.images.map((image, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={`drop-zone ${props.layout}`}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={handleDragOver}
                        >
                            <img src={image.src} alt={`${image.author} - ${image.description}`} className="page-image" />
                        </div>
                    </React.Fragment>
                ))}
                {props.images.length < (props.layout === "vertical" ? 2 : props.layout === "horizontal" ? 2 : props.layout === "grid-2x2" ? 4 : 1) && (
                    <div
                        className="drop-zone"
                        onDrop={(e) => handleDrop(e, props.images.length)}
                        onDragOver={handleDragOver}
                    >
                        <span className="drop-text">Drop Photo</span>
                    </div>
                )}
            </div>

            {/* Opis i autor, zależnie od layoutu */}
            <div className="xd">
            {props.images.slice(0, 4).map((image, index) => (
                <div key={index} className="image-info">
                    {/* Dla layoutu 'vertical' (domyślny) - opis poniżej zdjęcia */}
                    {props.layout === "vertical" && (
                        <div className="vertical-layout">
                            <span className="author"><strong>Author:</strong> {image.author}</span><br />
                            <span className="description"><strong>Descr:</strong> {image.description}</span><br />
                        </div>
                    )}

                    {/* Dla layoutu 'horizontal' - opis obok zdjęcia */}
                    {props.layout === "horizontal" && (
                        <div className="horizontal-layout">
                            <span className="author"><strong>Author:</strong> {image.author}</span><br />
                            <span className="description"><strong>Descr:</strong> {image.description}</span><br />
                        </div>
                    )}

                    {/* Dla layoutu 'grid-2x2' - opis poniżej zdjęcia */}
                    {props.layout === "grid-2x2" && (
                        <div className="grid-2x2-layout">
                            <span className="author"><strong>Author:</strong> {image.author}</span><br />
                            <span className="description"><strong>Descr:</strong> {image.description}</span><br />
                        </div>
                    )}

                    {/* Dla innych layoutów - opis poniżej zdjęcia */}
                    {(props.layout == "default" && props.layout !== "grid-2x2") && (
                        <div className="default-layout">
                            <span className="author"><strong>Author:</strong> {image.author}</span><br />
                            <span className="description"><strong>Descr:</strong> {image.description}</span><br />
                        </div>
                    )}
                </div>
            ))}
            </div>

            <div className="page-number">
                {`Page ${props.number}`}
            </div>
        </div>
    );
});

export default Page;