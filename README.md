# StudyBuddy 스터디버디

<img width="100%" alt="studybuddyLogo" src="https://github.com/user-attachments/assets/3823aa72-9c72-47d6-8db0-447926c58243">

<br/><br/>

## 📝 프로젝트 소개

**온라인에서 동일한 시험 또는 분야를 학습하는 사람들끼리 정보와 자료를 공유하는 공간입니다.**

- ⭐ **정보 공유**: 시험 준비나 학습에 도움이 되는 자료를 업로드하고 공유할 수 있습니다.
- ⭐ **커뮤니티**: 시험 또는 학습 분야에 대해 관심이 있는 다른 사용자들과 함께 커뮤니티에 가입할 수 있습니다.
- ⭐ **자료 저장**: 특정 자료를 보고 나중에 다시 확인하고 싶을 때를 위해 북마크 기능을 추가할 수 있습니다.

<br />
StudyBuddy Server: https://github.com/jihyezi/StudyBuddy-server

<br/><br/><br/>

## 🙋‍♂️ 팀원 구성

<div align="center">

| **김도영**   | **김상우**   | **이재호**   | **하지혜**   |
|:-----------:|:-----------:|:-----------:|:-----------:|
| [@rlaehdud159](https://github.com/rlaehdud159) | [@BlackShrike](https://github.com/BlackShrike) | [@jaeho9](https://github.com/jaeho9) | [@jihyezi](https://github.com/jihyezi) |

</div>


<br/><br/><br/>

## 1. 🖥️ 개발 환경

**Environment**
<br/>
<img  src="https://img.shields.io/badge/VISUAL STUDIO CODE-29B6F6?style=for-the-badge&logo=visual studio&logoColor=white"/> <img  src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=GIT&logoColor=white"/> <img  src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=GITHUB&logoColor=white"/>

**Config**
<br/>
<img  src="https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=NPM&logoColor=white"/>

**Development**
<br/>
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img  src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/react-black?style=for-the-badge&logo=react&logoColor=61DAFB"> <img src="https://img.shields.io/badge/react query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> <img  src="https://img.shields.io/badge/supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white"> <img  src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">

**Communication**
<br/>
<img src="https://img.shields.io/badge/SLACK-4A154B?style=for-the-badge&logo=slack&logoColor=white"> <img src="https://img.shields.io/badge/NOTION-black?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/DISCORD-5865F2?style=for-the-badge&logo=discord&logoColor=white">

**Deployment**
<br/>
<img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">

<br/><br/>

## 2. 🗂️ 프로젝트 구조

```
📦StudyBuddy
 ┣ 📂public
 ┃ ┣ 📜index.html
 ┣ 📂src
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📜CommonApi.jsx
 ┃ ┃ ┗ 📜DataContext.jsx
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📂icons
 ┃ ┃ ┗ 📂images
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂Bookmark
 ┃ ┃ ┣ 📂Communities
 ┃ ┃ ┣ 📂Explore
 ┃ ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┃ ┣ 📜useCommunities.jsx
 ┃ ┃ ┃ ┃ ┣ 📜usePostsAndUsers.jsx
 ┃ ┃ ┃ ┃ ┗ 📜useStudies.jsx
 ┃ ┃ ┣ 📂Home
 ┃ ┃ ┣ 📂Messages
 ┃ ┃ ┣ 📂Post
 ┃ ┃ ┣ 📂Profile
 ┃ ┃ ┣ 📂Sidebar
 ┃ ┃ ┣ 📂Studies
 ┃ ┣ 📂contexts
 ┃ ┃ ┗ 📜AuthContext.jsx
 ┃ ┣ 📂fonts
 ┃ ┣ 📂pages
 ┃ ┃ ┣ 📂Bookmarks
 ┃ ┃ ┣ 📂Communities
 ┃ ┃ ┣ 📂Explore
 ┃ ┃ ┣ 📂Home
 ┃ ┃ ┣ 📂Messages
 ┃ ┃ ┣ 📂Notifications
 ┃ ┃ ┣ 📂Post
 ┃ ┃ ┣ 📂Profile
 ┃ ┃ ┣ 📂Recommended
 ┃ ┃ ┗ 📂Studies
 ┃ ┣ 📂utils
 ┃ ┃ ┗ 📜searchHistory.jsx
 ┃ ┣ 📜App.css
 ┃ ┣ 📜App.js
 ┃ ┣ 📜App.module.css
 ┃ ┣ 📜App.test.js
 ┃ ┣ 📜index.css
 ┃ ┣ 📜index.js
 ┃ ┣ 📜setupProxy.js
 ┃ ┗ 📜setupTests.js
 ┣ 📜.env
 ┣ 📜.gitignore
 ┣ 📜jsconfig.json
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜server.js
 ┗ 📜README.md
```

<br/><br/>

## 3. 👥 역할 분담

### **김도영**

- **UI Design**
- **Page**
  - Communities
  - Bookmark
  - Post
  - Sidebar

### **김상우**

- **DB Design**
- **Page**
  - Notifications
  - Messages

### **이재호**

- **DB Design**
- **Page**
  - Home
  - Login/SignUP
  - Explore

### **하지혜**

- **UI Design**
- **Page**
 - Profile
 - Communities
 - Bookmark

<br/><br/><br/>

## 4. ⏱️ 개발 기간 및 작업 관리

### 개발 기간

- **전체 개발 기간** : 2024년 5월 22일 ~ 12월 9일
- **UI 구현** : 2024년 5월 22일 ~ 6월 10일
- **기능 구현** : 2024년 6월 11일 ~ 12월 9일

### 작업 관리

- **진행 상황 공유** : Discord를 활용하여 팀원들과 실시간 소통하며 진행 상황을 공유했습니다
- **회의 및 기록** : 매주 정기적으로 회의를 진행하며 작업 순서와 방향성을 논의하였고, 주요 논의 사항과 결론은 Notion에 정리하여 기록 및 공유했습니다.

<br/><br/><br/>

## 5. 📄 페이지별 기능

### Home

1. **온보딩**
 - StudyBuddy 설명 온보딩을 통해 안내 메시지를 전달합니다.
<p align="center">
<img width="90%" alt="온보딩" src="https://github.com/user-attachments/assets/c94234b9-eac7-4a9a-a2ce-aa6735d651b5">
</p>
<br />


2. **Hot 커뮤니티**
 - 인기있는 커뮤니티를 보여주고 클릭하면 상세 커뮤니티 페이지로 이동합니다.
<p align="center">
<img width="90%" alt="Hot 커뮤니티" src="https://github.com/user-attachments/assets/d0f09e6c-aefc-4373-b2a4-450781916114">
</p>
<br/>

3. **인기글**
 - 인기 게시글을 보여주고 클릭하면 상세 게시글 페이지로 이동합니다.
<p align="center">
<img width="90%" alt="인기글" src="https://github.com/user-attachments/assets/909bec0c-cb47-48d5-bafb-12759bad686e">
</p>
<br/>

4. **태그별 인기 스터디**
 - 태그별 인기 스터디를 보여주고 클릭하면 상세 스터디 페이지로 이동합니다.
<p align="center">
<img width="90%" alt="태그별 인기 스터디" src="https://github.com/user-attachments/assets/81589a68-16fc-41c8-8dba-f3c84e25b725">
</p>
<br/>

### Explore

1. **검색 기능**
 - 검색 결과에 맞는 커뮤니티, 게시글, 스터디 목록을 보여줍니다.
<img width="90%" alt="검색 기능" src="https://github.com/user-attachments/assets/19661c93-e7f1-40af-83ac-718aaca9ac69">
<br/>

2. **검색 기록**
 - 로그인한 아이디별로 검색 기록을 보여주고 선택 삭제 기능을 제공합니다.
<img width="90%" alt="검색 기록" src="https://github.com/user-attachments/assets/6b84bdf9-d15d-4426-8c44-f7bf2668876a">
<br/>

3. **인기태그**
 - 인기 태그를 보여주고 클릭하면 해당 태그를 검색합니다.
<img width="90%" alt="인기태그" src="https://github.com/user-attachments/assets/17335eb0-6eb1-4995-9a15-b4ff6a00075e">
<br/>

4. **Hot 커뮤니티**
 - 인기있는 커뮤니티를 보여주고 클릭하면 상세 커뮤니티 페이지로 이동합니다.
<img width="90%" alt="Hot 커뮤니티" src="https://github.com/user-attachments/assets/64c0445b-755b-4ecf-8b90-e914b5f7f478">
<br/>

5. **인기 스터디**
 - 인기 스터디 게시글을 보여주고 클릭하면 상세 스터디 페이지로 이동합니다.
<img width="90%" alt="인기 스터디" src="https://github.com/user-attachments/assets/b03b2907-41b1-401e-b8a4-ac029d679712">
<br/>

### Communities

1. **커뮤니티 목록**
 - **로그아웃 또는 미가입 상태**: 커뮤니티 분류 목록이 표시되며, 각 분류를 클릭하면 해당 분류의 게시글을 확인할 수 있습니다.
<p align="center">
<img width="90%" alt="로그아웃 상태 커뮤니티" src="https://github.com/user-attachments/assets/7f2d4859-e26f-4678-997e-cb741a26fe04">
<p align="center">
 <br />

 - **가입 상태**: 가입한 커뮤니티 목록이 표시되며, 목록에서 커뮤니티를 클릭하면 상세 페이지로 이동할 수 있습니다.
<p align="center">
<img width="90%" alt="커뮤니티 가입 목록" src="https://github.com/user-attachments/assets/67135d31-6d84-484e-b0da-daf4c88e6f23">
</p>
 <br />

 - **모든 커뮤니티 보기**: 모든 커뮤니티는 분야별로 분류되어 정리되어 있습니다.
<p align="center">
<img width="90%" alt="커뮤니티 모든" src="https://github.com/user-attachments/assets/422b69a4-b0e8-4aa8-b72f-3afeb870f832">
</p>
 <br />

2. **커뮤니티 상세 페이지**
 - **탭 메뉴**: 커뮤니티의 인기 게시글, 최신 게시글, 규칙, 멤버 등의 정보를 확인할 수 있습니다.
<p align="center">
<img width="90%" alt="커뮤니티 상세 페이지" src="https://github.com/user-attachments/assets/ff757b96-adee-4797-96c8-64de09f57509">
</p>
 <br />

 - **커뮤니티 가입**: 가입하면 해당 커뮤니티 게시글을 확인할 수 있으며, 가입 목록에도 추가됩니다.
<p align="center">
<img width="90%" alt="커뮤니티 가입" src="https://github.com/user-attachments/assets/2714d823-fb2c-4891-9e7a-7b9ed5238ef8">
</p>
 <br />
<br />

 - **커뮤니티 탈퇴**: 탈퇴 시에는 가입 목록에서 삭제됩니다.
<p align="center">
<img width="90%" alt="커뮤니티 나가기" src="https://github.com/user-attachments/assets/4aef4df7-264a-47eb-8960-5e02ef3da8d4">
<p align="center">
 <br />

3. **커뮤니티 게시물**
 - **기능**: 게시글에 좋아요, 북마크, 공유 기능이 제공됩니다.
<p align="center">
<img width="90%" alt="좋아요 북마크 공유" src="https://github.com/user-attachments/assets/985ab783-3699-43fa-b9bb-72806af9a71e">
</p>
 <br />


 - **작성자 권한**: 자신이 작성한 게시글은 삭제할 수 있습니다.
<p align="center">
<img width="90%" alt="게시물 삭제" src="https://github.com/user-attachments/assets/29722794-c925-4dac-8168-961d037aa74e">
</p>
 <br />

 - **게시글 상세 정보**: 게시글의 준비 기간, 참고 자료, 결과 등의 세부 사항이 표시됩니다.
 - **댓글**: 댓글 섹션에서 댓글을 작성하고 다른 사용자의 댓글을 확인할 수 있습니다.
<p align="center">
<img width="90%" alt="상세 게시물 - 댓글" src="https://github.com/user-attachments/assets/37445356-51f9-4f55-8231-f5babd801160">
</p>
 <br />

 - **상세 게시글에서 커뮤니티 이동**: 상세 게시글에서 커뮤니티를 클릭하면 커뮤니티 상세 페이지로 이동합니다.
<p align="center">
<img width="90%" alt="상세 게시글 커뮤니티" src="https://github.com/user-attachments/assets/9eb7cba9-17b7-4d5b-9aca-748aeabec8e5">
</p>
 <br />



### Studies

1. **스터디 분류&피드** : 온라인 및 오프라인 스터디 분류가 표시되며, 클릭하면 해당 분류의 스터디를 확인할 수 있습니다.
<br />

2. **스터디 상세 페이지**
 - **정보 확인**: 스터디의 진행 방식, 모집 인원, 장소 등의 세부 사항이 표시됩니다.
 - **댓글 작성**: 댓글 섹션에서 댓글을 작성하고 다른 사용자의 댓글을 확인할 수 있습니다.
 - **스터디 수정 및 삭제**: 사용자가 작성한 스터디에 `…` 아이콘이 표시되며, 클릭 시 수정 및 삭제 옵션이 나타납니다.
<p align="center">
<img width="90%" alt="스터디" src="https://github.com/user-attachments/assets/6462189c-382c-44dc-9c88-c9babd47753a">
</p>
 <br/>

### Notifications
1. **알림**: DM, 내가 가입한 커뮤니티의 새 글, 내가 쓴 글(포스트, 댓글)의 댓글이 작성되거나 좋아요가 추가된다면 해당 유저에게 알림이 갑니다.
<p align="center">
<img width="90%" alt="좋아요 북마크 공유" src="https://github.com/user-attachments/assets/b134b3df-db23-43aa-947c-d1a5d32d1e99">
</p>
   <br/>
   
### Messages
1. **메시지**: 새 유저와 대화를 시작하거나 기존 유저와 대화를 할 수 있습니다.
<p align="center">
<img width="90%" alt="좋아요 북마크 공유" src="https://github.com/user-attachments/assets/2ba88018-178d-45d2-88a4-fe12ab7604d5">
</p>
<br />

2. **삭제**: 필요시 대화 내용을 삭제하여 초기화할 수 있습니다.
<p align="center">
<img width="90%" alt="좋아요 북마크 공유" src="https://github.com/user-attachments/assets/fb80a31b-d4a9-4a9b-8fe1-201ca64f3ff4">
</p>
   <br/>
   
### Bookmarks
1. **커뮤니티 목록**: 사용자가 북마크한 게시글의 커뮤니티 목록이 나열되며, 클릭 시 해당 커뮤니티의 게시글 중 사용자가 북마크한 게시글만 표시됩니다.
2. **북마크 게시글 확인**: 사용자가 북마크한 게시글이 작성 시간 순으로 나열됩니다.
3. **북마크 추가**: 커뮤니티 상세 페이지에서 북마크 아이콘을 클릭하여 게시글을 추가할 수 있으며 Bookmarks 페이지에 나열되어 쉽게 관리할 수 있습니다.
4. **북마크 해제**: 해제 시 해당 게시글이 즉시 북마크 목록에서 제거됩니다.
<img alt="북마크" src="https://github.com/user-attachments/assets/05c89788-6bf0-48b8-a16a-476f7f604920">
   <br/>
   
### Profile
1. **사용자 프로필**: 사용자 닉네임, 한 줄 소개, 생일, 활동 탭 정보를 확인할 수 있으며, 프로필 수정 버튼을 통해 정보를 변경할 수 있습니다.
<img alt="프로필 탭" src="https://github.com/user-attachments/assets/1e849c74-6561-4ce9-acbf-42528252a5a7">
<br />

2. **프로필 수정**: 프로필 사진, 닉네임, 한 줄 소개, 생일을 수정할 수 있는 폼(Form)이 제공됩니다.
<img alt="프로필 수정" src="https://github.com/user-attachments/assets/efb827b1-40d7-41f4-b51c-2389f6725da0">
<br />

3. **다른 사용자 프로필**: 상세 게시글에서 프로필을 클릭하면, 해당 사용자의 닉네임, 한 줄 소개, 생일, 활동 탭 정보를 확인할 수 있습니다.
<img alt="프로필 수정" src="https://github.com/user-attachments/assets/696a13f6-ea22-46ea-812c-2f8816553c4d">
<br />

### Post

1. **게시글 작성** : 사용자는 가입한 커뮤니티에 한해 해당 커뮤니티와 관련 게시글을 작성할 수 있습니다.
<img alt="게시물 작성" src="https://github.com/user-attachments/assets/c2fc3425-f0ba-4e37-9bf6-9032899dcb22">
<br />

2. **커뮤니티 개설** : 사용자는 새로운 커뮤니티를 생성할 수 있습니다.
<img alt="커뮤니티 개설" src="https://github.com/user-attachments/assets/2ae449bf-c748-400f-9387-184c86113b05">
<br />

3. **스터디 생성** : 사용자는 온라인 또는 오프라인 스터디를 모집할 수 있습니다.
<img alt="스터디 생성" src="https://github.com/user-attachments/assets/683f8605-03f4-4fa7-be2b-d299d0dd2e0a">
   <br/>

### SignUp

1. **회원가입**: 사용자는 본인이 사용하는 이메일을 통해 회원가입을 할 수 있습니다.
2. **중복확인**: 회원가입을 할 때 아이디, 닉네임 중복 확인 기능을 제공합니다.
<p align="center">
<img width="90%" alt="회원가입" src="https://github.com/user-attachments/assets/2745b5f0-00c7-4c36-9868-0e304ec9b5b3">
</p>

<br/>

### Login/Logout

1. **로그인**: 사용자는 회원가입을 한 이메일을 통해 로그인 할 수 있습니다.
2. **로그아웃**: 사용자는 로그아웃 버튼을 통해 로그아웃을 할 수 있습니다.
<p align="center">
<img width="90%" alt="로그인" src="https://github.com/user-attachments/assets/d9056906-696f-438d-9fbf-c331bf35cc26">
</p>
   <br/><br/>

## 6. ❗ 트러블 슈팅
* [Home 컴포넌트 리렌더링 이슈](https://github.com/jihyezi/StudyBuddy/wiki/README-6.-%ED%8A%B8%EB%9F%AC%EB%B8%94-%EC%8A%88%ED%8C%85_Home-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EB%A6%AC%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%9D%B4%EC%8A%88)
* [React Query를 통한 성능 문제 개선](https://github.com/jihyezi/StudyBuddy/wiki/README-6.-%ED%8A%B8%EB%9F%AC%EB%B8%94-%EC%8A%88%ED%8C%85_React-Query%EB%A5%BC-%ED%86%B5%ED%95%9C-%EC%84%B1%EB%8A%A5-%EB%AC%B8%EC%A0%9C-%EA%B0%9C%EC%84%A0)
* [배포 후 네이버 API 통신 문제](https://github.com/jihyezi/StudyBuddy/wiki/README-6.-%ED%8A%B8%EB%9F%AC%EB%B8%94-%EC%8A%88%ED%8C%85_%EB%B0%B0%ED%8F%AC-%ED%9B%84-%EB%84%A4%EC%9D%B4%EB%B2%84-API-%ED%86%B5%EC%8B%A0-%EB%AC%B8%EC%A0%9C)
* [좋아요 기능 이슈](https://github.com/jihyezi/StudyBuddy/wiki/README-6.-%ED%8A%B8%EB%9F%AC%EB%B8%94-%EC%8A%88%ED%8C%85_%EC%A2%8B%EC%95%84%EC%9A%94-%EA%B8%B0%EB%8A%A5-%EC%9D%B4%EC%8A%88)
* [Supabase 트리거 이슈](https://github.com/jihyezi/StudyBuddy/wiki/README-6.-%ED%8A%B8%EB%9F%AC%EB%B8%94-%EC%8A%88%ED%8C%85_Supabase-%ED%8A%B8%EB%A6%AC%EA%B1%B0-%EC%9D%B4%EC%8A%88)
<br/><br/><br/>

## 7. 🔧 개선 목표
* **성능 개선 전**
<img alt="성능 개선 전" src="https://github.com/user-attachments/assets/161805d9-8236-4c12-b018-887dde4f34e3">
<br/><br/>

* **성능 개선 후**
  <img alt="성능 개선 후" src="https://github.com/user-attachments/assets/67ff48b8-0730-4361-9b40-86329c8e7c8b">
  
  * 웹 폰트 로드 최적화 : font-display: swap 속성을 적용해 폰트 로드 중 텍스트 비가시성 문제(FOIT) 해결. 초기 로딩 속도 개선 및 사용자 경험 향상.
  * PNG → WebP 변환 : PNG 이미지를 WebP 포맷으로 변환해 페이지 로드 속도 단축 및 Google Lighthouse 점수 개선.
<br/><br/><br/>

## 8. 💬 후기

### 💩 김도영

작년 12월 부트캠프에서 프론트엔드 관련 내용을 학습하고 프로젝트를 통해 만난 팀원들과 지금까지 팀프로젝트를 진행하며 많은 것을 배웠습니다. 하나하나 결정해나가며 의견을 조율하고 모르는 부분을 서로 공유하며 도와주며 최대한으로 좋은 결과물을 만들어내기 위해 모두가 노력하는 과정이 즐거웠습니다. 생각보다 많은 시간이 소요되었지만 그만큼 많은 걸 얻을 수 있었고 특히 깃허브를 통한 협업이 처음에는 정말 어려웠지만 팀원들과 방법을 공유하며 협업에 익숙해질 수 있어서 좋았습니다. 그리고 팀 프로젝트에서 정말 좋은 팀원들을 만나서 부트캠프 끝난 이후에도 끝까지 함께 할 수 있었던 것이 가장 좋았고 함께 할 수 있어서 너무 좋았고 모두 고생했다고 전하고 싶습니다😊
<br/>

### 김상우

이번 프로젝트를 진행하면서 처음 느낀것은 아직도 배워야 할 것이 많았다는 것이었습니다. 새로운 기능을 추가하는데 필요한 코드들과 이것들을 간소화할 라이브러리 도입 사이에서 성능과 편리함 사이에서 고민하고 이전에는 해본 적 없던 것들을 시행착오를 겪어가며 하나하나 수정해가는 과정에서 많은 것들을 배웠으며 팀원과의 소통을 통해 혼자서 해결할려고 하였으면 오래 걸렸을 것들을 수정해가는 과정에서 팀워크의 중요성을 느끼기도 했습니다. 그동안 함께 고민하고 달려온 팀원들에게 감사하며 앞으로도 좋은 일이 있기를 기원합니다!
 <br/>

### 이재호

부트캠프에서 함께 공부했던 팀원들과 다시 프로젝트를 진행하면서, 처음부터 끝까지 우리의 손으로 만들어가는 과정을 경험했습니다. 아무것도 없는 상태에서 디자인부터 최종 마무리까지 각자 의견을 나누고 부족한 점을 함께 논의하며, 서로 개발자로서 성장해가는 모습을 직접 볼 수 있어 정말 뜻깊은 시간이었습니다.
백엔드 없이 프로젝트를 진행하려다 보니 어려움도 많았지만, 문제를 함께 해결해 나가면서 처음 사용하는 기술들도 많이 배울 수 있었습니다.
마지막으로, 이 프로젝트를 함께 해준 팀원들 모두가 최선을 다해준 덕분에 즐겁게 프로젝트를 마무리할 수 있었습니다. 정말 수고 많으셨습니다!
<br/>

### 하지혜

studybuddy 프로젝트를 진행하며 정말 많은 것을 배울 수 있었습니다. 처음에는 기획부터 배포까지 생소한 부분이 많아 어려움도 있었지만, 팀원들과 함께 협력하며 하나씩 해결해 나갔던 과정이 뜻깊었습니다. 이번 프로젝트에서는 기존에 사용해보지 않았던 기술들을 직접 구현해보는 기회가 많았고, 기능 개발 과정에서 발생한 오류들을 해결하며 기술적인 역량을 키울 수 있었습니다. 또한, 좋은 결과물을 만들기 위해 어떻게 해야 할지 팀원들과 의견을 나누며 협업의 중요성을 체감했습니다. 서로의 아이디어를 존중하고 문제를 함께 해결하면서 혼자서는 얻기 힘든 깊은 통찰과 경험을 쌓을 수 있었습니다. 모든 팀원이 각자의 역할에 최선을 다했기 때문에 좋은 결과물을 만들어낼 수 있었던 것 같습니다. 수고하셨습니다~~🤗

<br/>

<a href="https://github.com/jihyezi/StudyBuddy"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fjihyezi%2FStudyBuddy&count_bg=%23555555&title_bg=%23555555&icon=github.svg&icon_color=%23E7E7E7&title=GitHub&edge_flat=false"/></a>
