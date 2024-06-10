import React from "react";
import './Components.css';

const Inputfield = (props) => {
    return (
        <div className="InputContainer">
            <div className="Title">{props.title}</div>
            <input
                className="InputField"
                type="text"
                placeholder={props.placeholder} />
        </div>
    )
}


export default Inputfield;