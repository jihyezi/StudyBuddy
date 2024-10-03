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
    <div>
      {postData.map((post) => (
        <Post
          key={post.postid} // post.id -> post.postid 로 수정
          post={post}
          community={communityData}
          user={userData}
          allUser={allUserData}
          comment={commentData}
          onBookmarkToggle={onBookmarkToggle}
        />
      ))}
    </div>
  );
};

export default CommunityPostList;
