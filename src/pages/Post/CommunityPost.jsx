import React, { useEffect, useState, useRef } from "react";

// component
import Header from "components/Post/Header";
import InputFile from "components/Post/InputFile";
import InputText from "components/Post/InputText";

const CommunityPost = ({}) => {
  return (
    <div>
      <Header />
      {/* <InputFile /> */}
      <div>
        <InputText
          title={"이름"}
          placeholder={"커뮤니티 이름을 입력해주세요."}
        />
        <InputText
          title={"설명"}
          placeholder={"커뮤니티에 대해 간단하게 설명해주세요."}
        />
      </div>
    </div>
  );
};
export default CommunityPost;
