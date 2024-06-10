import React from "react";
import '../components/Components.css';

import heart_off from '../assets/icons/favorite_off.png';
import heart_on from '../assets/icons/favorite_on.png';
import comment from '../assets/icons/comment.png';
import share from '../assets/icons/share.png';
import person from '../assets/icons/person.png';


const StudyPost = (props) => {
    return (
        <div className="StudyPostContainer">
            <div className="StudyPostWrapper">
                <div className="StudyPostTitleContainer">
                    {props.state === '1' ? <div className="StudyPostState">모집중</div> : <div className="StudyPostState2">모집완료</div>}
                    <div className="StudyPostTitle">{props.title}</div>
                </div>
                <div className="StudyPostDescription">{props.content}</div>
                <div className="StudyPostTags">
                    {props.tag.map((tag, index) => (
                        <div key={index} className="StudyPostTag">{tag}</div>
                    ))}
                </div>

                <div className="StudyPostFooter">
                    <div className="StudyPostIconGroup">
                        <div className="StudyPostIcon">
                            <img src={person} alt="person" />
                            <div style={{ color: '#606060', fontSize: 12, fontWeight: 500 }}>{props.person}명</div>
                        </div>
                        <div style={{ width: 2, height: 2, background: '#606060', borderRadius: 25 }} />
                        <div style={{ color: '#606060', fontSize: 12, fontWeight: 500 }}>{props.type}</div>
                    </div>
                    <div className="StudyPostIconGroup">
                        <div className="StudyPostIcon">
                            <img src={heart_off} alt="heart_off" />
                            <span>123</span>
                        </div>
                        <div className="StudyPostIcon">
                            <img src={comment} alt="comment" />
                            <span>123</span>
                        </div>
                        <div className="StudyPostIcon">
                            <img src={share} alt="share" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudyPost;
