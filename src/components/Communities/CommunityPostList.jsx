import React from "react";
import Post from "./Post";
import { dummyPostData } from "../Dummydata";

const getPostsByEvent = (event) => {
  return dummyPostData.filter((post) => post.event === event);
};

const CommunityPostList = ({ selectedEvent }) => {
  const postList = selectedEvent ? getPostsByEvent(selectedEvent) : [];

  return (
    <div>
      {postList.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default CommunityPostList;
