import React from 'react';
import './Components.css';

const InputButton = (props) => {

    const handler = () => {

    };

    return (
        <div className='InputContainer'>
            <div className='Title'>{props.title}</div>
            <div className='InputButton' onClick={handler}>
                <span className='Placeholder'>{props.placeholder}</span>
                <img className='ButtonImage' src={props.btnimg} />
            </div>
        </div>
    )
}

export default InputButton;