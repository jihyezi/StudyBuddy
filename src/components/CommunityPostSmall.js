
import React from "react";
import '../components/Components.css';

import imgbackground from '../assets/images/bookmarkbackground.png';

const CommunityPostSmall = (props) => {
    return (
        <div className="community-post-container">
            <div className="community-post-left">
                <img src={props.communityimg} className="community-post-image" />
                <div className="community-post-details">
                    <div className="community-post-title">{props.communityname}</div>
                    <div className="community-post-info">
                        <div className="community-post-info-row">
                            <span className="community-post-info-label">인원</span>
                            <span className="community-post-info-value">{props.person}명</span>
                        </div>
                        <div className="community-post-info-row">
                            <span className="community-post-info-label">게시글</span>
                            <span className="community-post-info-value">{props.post}개</span>
                        </div>
                        <div className="community-post-info-row">
                            <span className="community-post-info-label">시작일</span>
                            <span className="community-post-info-value">{props.date}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="community-post-icon-wrapper">
                <img src={imgbackground} className="community-post-icon-background" />
                <img src={props.commmunityicon} className="community-post-icon-palette" />
            </div>
        </div>
    )
}

export default CommunityPostSmall;