/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from "react";

const Page = React.forwardRef((props, ref) => {

    const handleDrop = (e, index) => {
        e.preventDefault();
        const src = e.dataTransfer.getData("text");
        const layout = e.dataTransfer.getData("layout") || "default";
        props.onImageDrop(src, props.number, layout, index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className={`page ${props.layout}`} ref={ref} data-page={props.number}>
            <h1 className="page-header">{props.header}</h1>
            <div className="image-container">
                {props.images.map((image, index) => (
                    <div
                        key={index}
                        className={`drop-zone ${props.layout}`}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={handleDragOver}
                    >
                        <img src={image.src} alt="Dynamic" className="page-image" />
                    </div>
                ))}
                {props.images.length < (props.layout === "vertical" ? 2 : props.layout === "horizontal" ? 2 : props.layout === "grid-2x2" ? 4 : 1) && (
                    <div
                        className="drop-zone"
                        onDrop={(e) => handleDrop(e, props.images.length)}
                        onDragOver={handleDragOver}
                    >
                        <span className="drop-text">Upuść zdjęcie</span>
                    </div>
                )}
            </div>
            <div className="page-number">
                {`Strona ${props.number}`}
            </div>
        </div>
    );
});

export default Page;