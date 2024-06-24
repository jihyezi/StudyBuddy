import React from 'react';
import Post from './Post';
import { dummyPostData } from '../Dummydata'

const CommunityPostList = ({ postData }) => {

    return (
        <div>
            {postData.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
};

export default CommunityPostList;