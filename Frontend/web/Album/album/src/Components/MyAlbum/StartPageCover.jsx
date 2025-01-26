/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from "react";

const StartPageCover = React.forwardRef((props, ref) => {
    return (
        <div style={{ textAlign: "center" }}>
            <div className="coverStart" ref={ref} data-density="hard">
                <h2>{props.children}</h2>
            </div>
        </div>
    );
});

export default StartPageCover;