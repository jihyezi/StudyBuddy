import React, { useEffect, useState, useRef } from "react";

// component
import DeleteModal from "components/Messages/DeleteModal";
import SearchUserModal from "components/Messages/SearchUserModal";
import MyMessage from "components/Messages/MyMessage";
import OtherMessage from "components/Messages/OtherMessage";

const Messages = ({}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <DeleteModal />
      </div>
      <div>
        <SearchUserModal />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <MyMessage />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <OtherMessage />
      </div>
    </div>
  );
};
export default Messages;
