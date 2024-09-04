import React from 'react';
import Post from './Post';

const CommunityPostList = ({ postData, communityData, userData, commentData }) => {

    return (
        <div>
            {postData.map((post) => (
                <Post key={post.id} post={post} community={communityData} user={userData} comment={commentData} />
            ))}
        </div>
    );
};

export default CommunityPostList;