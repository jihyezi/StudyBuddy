import React from "react";
import Post from "./Post";

const CommunityPostList = ({
  userData,
  allUserData,
  postData = [],
  communityData,
}) => {
  return (
    <div style={{ width: '100%' }}>
      {postData.length > 0 ? (
        postData.map((post) => (
          <Post
            key={post.postid}
            userData={userData}
            allUserData={allUserData}
            thisPost={post}
            postData={postData}
            communityData={communityData}
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
