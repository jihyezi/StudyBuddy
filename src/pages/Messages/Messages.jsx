import React from "react";

// component
import DMList from "components/Messages/DMList";

const Messages = ({ }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: '100%' }}>
      <div>
        <DMList />
      </div>
    </div>
  );
};
export default Messages;
