import React from 'react';
import './Components.css';
import profile from '../assets/images/profile1.png'

const Comments = (props) => {
    return (
        <div className='Container'>
            <div>
                <img className='Profile' src={props.profile} />
            </div>
            <div className='ContentContainer'>
                <div className='Info'>
                    <span className='Nickname'>{props.nickname}</span>
                    <span className='Time'>{props.time}</span>
                </div>
                <span className='Content'>{props.content}</span>
                <button className='Button'>답글 달기</button>
            </div>

        </div>
    )
}

export default Comments;
