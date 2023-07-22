import React from 'react';
import './SortingBar.css';

const SortingBar = ({ value, isHighlighted, isSwapped }) => {
    const barStyle = {
        height: `${value}px`,
        backgroundColor: isHighlighted
            ? '#ff4136'
            : isSwapped
                ? '#0074d9'
                : '#0074d9',
    };

    return <div className="sorting-bar" style={barStyle}>{value}</div>;
};

export default SortingBar;