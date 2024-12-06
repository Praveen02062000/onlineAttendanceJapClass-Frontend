import React from 'react';
import flImage from "../Assets/fl.png";

function Loader({ title }) {
    return (
        <div className='load'>
            <div className="spinner-border text-danger spin" role="status">
                <span className="visually-hidden">Loading...</span>
                <img src={flImage} />
            </div>
            <p>{title}</p>
        </div>
    )
}

export default Loader