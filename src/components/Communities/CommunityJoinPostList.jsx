import React from "react";
import Post from "./Post";

const CommunityPostList = ({ postData = [], newPost }) => {
  // newPost가 있을 때만 sortedPosts 적용
  const sortedPosts = newPost
    ? postData.sort((a, b) => new Date(b.createdat) - new Date(a.createdat))
    : postData;

  return (
    <div style={{ width: "100%" }}>
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => <Post key={post.postid} postId={post.postid} />)
      ) : (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "24px",
            fontFamily: "BalooTammudu2-SemiBold",
            color: "#7b7b7b",
          }}
        >
          No Posts Yet.
        </div>
      )}
    </div>
  );
};

export default CommunityPostList;
