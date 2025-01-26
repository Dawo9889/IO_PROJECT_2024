/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from "react";

const EndPageCover = React.forwardRef((props, ref) => {
    return (
        <div className="coverBack" ref={ref} data-density="hard">
            <div>
                <h2>{props.children}</h2>
            </div>
        </div>
    );
});

export default EndPageCover;

