import React, { useState } from 'react';

import './style.scss';
// Example from https://paladini.dev/posts/how-to-make-an-extremely-reusable-tooltip-component-with-react--and-nothing-else/

const Tooltip = (props) => {
    let timeout;
    const [active, setActive] = useState(false);

    const showTip = () => {
        timeout = setTimeout(() => {
            setActive(true);
        }, props.delay || 300);
    };

    const hideTip = () => {
        clearInterval(timeout);
        setActive(false);
    };

    return (
        <div
            className="Tooltip-Wrapper"
            // When to show the tooltip
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
            onClick={hideTip}  
            >
                {/* Wrapping */}
                {props.children}
                {active && (
                    <div className={`Tooltip-Tip ${props.direction || "top"}`}>
                        {/* Content */}
                        {props.content}
                    </div>
                )}
        </div>
        );
    };

export default Tooltip;
