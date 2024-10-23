import React from "react";
import Post from "./Post";

const CommunityPostList = ({
  postData,
  communityData,
  userData,
  allUserData,
  commentData,
  onBookmarkToggle,
}) => {
  return (
    <div style={{ width: '100%' }}>
      {postData.length > 0 ? (
        postData.map((post) => (
          <Post
            key={post.postid}
            post={post}
            community={communityData}
            user={userData}
            allUser={allUserData}
            comment={commentData}
            onBookmarkToggle={onBookmarkToggle}
          />
        ))
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '24px', fontFamily: 'BalooTammudu2-SemiBold', color: '#7b7b7b' }}>
          No Posts Yet.
        </div>
      )}
    </div>
  );
};

export default CommunityPostList;
