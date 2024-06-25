import React, { useEffect, useState, useRef } from "react";
const SidebarItem = ({ menu }) => {
  return <span style={{ marginLeft: 20 }}>{menu.name}</span>;
};
export default SidebarItem;
