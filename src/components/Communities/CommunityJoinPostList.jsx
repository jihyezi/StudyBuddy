import React from "react";
import Post from "./Post";

const CommunityPostList = ({ postData = [] }) => {
  return (
    <div style={{ width: "100%" }}>
      {postData.length > 0 ? (
        postData.map((post) => <Post key={post.postid} postId={post.postid} />)
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
