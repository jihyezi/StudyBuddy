# StudyBuddy 스터디버디

<img width="100" alt="studybuddyLogo" src="https://github.com/user-attachments/assets/4ff2ebea-d439-45bc-82c0-9d1447f6ebde">
<br/><br/>

## 📝 프로젝트 소개

**온라인에서 동일한 시험 또는 분야를 학습하는 사람들끼리 정보와 자료를 공유하는 공간입니다.**

- ⭐ **정보 공유**: 시험 준비나 학습에 도움이 되는 자료를 업로드하고 공유할 수 있습니다.
- ⭐ **커뮤니티**: 시험 또는 학습 분야에 대해 관심이 있는 다른 사용자들과 함께 커뮤니티에 가입할 수 있습니다.
- ⭐ **자료 저장**: 특정 자료를 보고 나중에 다시 확인하고 싶을 때를 위해 북마크 기능을 추가할 수 있습니다.
  <br/><br/>

## 🙋‍♂️ 팀원 구성

| 💩 김도영                                         | 김상우                                         | 이재호                               | 하지혜                                 |
| ---------------------------------------------- | ---------------------------------------------- | ------------------------------------ | -------------------------------------- |
| [@rlaehdud159](https://github.com/rlaehdud159) | [@BlackShrike](https://github.com/BlackShrike) | [@jaeho9](https://github.com/jaeho9) | [@jihyezi](https://github.com/jihyezi) |

<br/><br/>

## 🖥️ 개발 환경

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

## 🗂️ 프로젝트 구조
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
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┣ 📜searchBook.js
 ┃ ┃ ┃ ┗ 📜searchPlace.js
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
 ┣ 📜README.md
 ┗ 📜vercel.json
```
<br/><br/>

## 👥 역할 분담

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
- **Page** - Communities - Profile - Bookmark
  <br/><br/>

## ⏱️ 개발 기간 및 작업 관리

### 개발 기간

- **전체 개발 기간** : 2024년 5월 22일 ~ 12월 9일
- **UI 구현** : 2024년 5월 22일 ~ 6월 10일
- **기능 구현** : 2024년 6월 11일 ~ 12월 9일

### 작업 관리
- **진행 상황 공유** : Discord를 활용하여 팀원들과 실시간 소통하며 진행 상황을 공유했습니다
- **회의 및 기록** : 매주 정기적으로 회의를 진행하며 작업 순서와 방향성을 논의하였고, 주요 논의 사항과 결론은 Notion에 정리하여 기록 및 공유했습니다.
  <br/><br/>

## 📄 페이지별 기능

### Home

1. 온보딩
   - StudyBuddy 설명 온보딩을 통해 안내 메시지를 전달합니다.
2. Hot 커뮤니티, 인기글, 태그별 인기 스터디 - 인기있는 커뮤니티를 보여주고 클릭하면 상세 커뮤니티 페이지로 이동합니다. - 인기 게시글을 보여주고 클릭하면 상세 게시글 페이지로 이동합니다. - 태그별 인기 스터디를 보여주고 클릭하면 상세 스터디 페이지로 이동합니다.
   <br/>

### Explore

1. 검색 기능
   - 검색 결과에 맞는 커뮤니티, 게시글, 스터디 목록을 보여줍니다.
2. 검색 기록
   - 로그인한 아이디별로 검색 기록을 보여주고 선택 삭제 기능을 제공합니다.
3. 인기태그, Hot 커뮤니티, 인기 스터디 - 인기 태그를 보여주고 클릭하면 해당 태그를 검색합니다. - 인기있는 커뮤니티를 보여주고 클릭하면 상세 커뮤니티 페이지로 이동합니다. - 인기 스터디 게시글을 보여주고 클릭하면 상세 스터디 페이지로 이동합니다.
   <br/>

### Communities

1. 커뮤니티 목록&피드
   - 로그아웃 또는 커뮤니티 미가입 시 커뮤니티 분류 목록이 표시되며, 클릭하면 해당 분류의 게시글을 확인할 수 있습니다.
   - 로그인 및 커뮤니티 가입 시 가입한 커뮤니티 목록이 표시되며, 클릭하면 상세 페이지로 이동합니다.
2. 커뮤니티 상세 페이지
   - 탭 메뉴: 커뮤니티의 인기 게시글, 최신 게시글, 규칙, 멤버 등의 정보를 확인할 수 있습니다.
   - 커뮤니티 관리: 커뮤니티 생성자는 커뮤니티 정보를 수정할 수 있습니다.
   - 가입 및 탈퇴: \*\*\*\*미가입 커뮤니티에는 ‘가입’ 버튼이, 가입한 커뮤니티에는 ‘나가기’ 버튼이 표시됩니다.
3. 커뮤니티 게시글 상세 페이지 - 정보 확인: 게시글의 준비 기간, 참고 자료, 결과 등의 세부 사항이 표시됩니다. - 댓글 작성: 댓글 섹션에서 댓글을 작성하고 다른 사용자의 댓글을 확인할 수 있습니다. - 게시글 수정 및 삭제: 사용자가 작성한 게시글에 `…` 아이콘이 표시되며, 클릭 시 수정 및 삭제 옵션이 나타납니다.
   <br/>

### Studies

1. 스터디 분류&피드 : 온라인 및 오프라인 스터디 분류가 표시되며, 클릭하면 해당 분류의 스터디를 확인할 수 있습니다.

2. 스터디 상세 페이지 - 정보 확인: 스터디의 진행 방식, 모집 인원, 장소 등의 세부 사항이 표시됩니다. - 댓글 작성: 댓글 섹션에서 댓글을 작성하고 다른 사용자의 댓글을 확인할 수 있습니다. - 스터디 수정 및 삭제: 사용자가 작성한 스터디에 `…` 아이콘이 표시되며, 클릭 시 수정 및 삭제 옵션이 나타납니다.
   <br/>

### Notifications

1. DM, 내가 가입한 커뮤니티의 새 글, 내가 쓴 글(포스트, 댓글)의 댓글이 작성되거나 좋아요가 추가된다면 해당 유저에게 알림이 갑니다.
   <br/>

### Messages

1. 새 유저와 대화를 시작하거나 기존 유저와 대화를 할 수 있으며 필요시 대화 내용을 삭제하여 초기화할 수 있습니다.
   <br/>

### Bookmarks

1. 커뮤니티 목록: 사용자가 북마크한 게시글의 커뮤니티 목록이 나열되며, 클릭 시 해당 커뮤니티의 게시글 중 사용자가 북마크한 게시글만 표시됩니다.

2. 북마크 게시글 확인: 사용자가 북마크한 게시글이 작성 시간 순으로 나열됩니다.

3. 북마크 추가: 커뮤니티 상세 페이지에서 북마크 아이콘을 클릭하여 게시글을 추가할 수 있으며 Bookmarks 페이지에 나열되어 쉽게 관리할 수 있습니다.

4. 북마크 해제: 해제 시 해당 게시글이 즉시 북마크 목록에서 제거됩니다.
   <br/>

### Profile

1. 프로필 조회: 사용자는 본인의 프로필 정보와 활동한 게시글 목록을 확인할 수 있습니다.

2. 프로필 수정: 프로필 사진, 닉네임, 한줄 소개, 생일을 수정할 수 있는 Form이 제공됩니다.

3. 활동 탭: 작성한 게시글, 좋아요를 누른 게시글, 댓글을 작성한 게시글을 탭으로 나누어 조회할 수 있습니다.
   <br/>

### Post

1. 게시글 생성 : 사용자는 가입한 커뮤니티에 한해 해당 커뮤니티와 관련 게시글을 작성할 수 있습니다.

2. 커뮤니티 생성 : 사용자는 새로운 커뮤니티를 생성할 수 있습니다.

3. 스터디 생성 : 사용자는 온라인 또는 오프라인 스터디를 모집할 수 있습니다.
   <br/>

### SignUp

1. 회원가입
   - 사용자는 본인이 사용하는 이메일을 통해 회원가입을 할 수 있습니다.
2. 중복확인 - 회원가입을 할 때 아이디, 닉네임 중복 확인 기능을 제공합니다.
   <br/>

### Login/Logout

1. 로그인
   - 사용자는 회원가입을 한 이메일을 통해 로그인 할 수 있습니다.
2. 로그아웃 - 사용자는 로그아웃 버튼을 통해 로그아웃을 할 수 있습니다.
   <br/><br/>

## 💬 후기

### 💩 김도영
작년 12월 부트캠프에서 프론트엔드 관련 내용을 학습하고 프로젝트를 통해 만난 팀원들과 지금까지 팀프로젝트를 진행하며 많은 것을 배웠습니다. 하나하나 결정해나가며 의견을 조율하고 모르는 부분을 서로 공유하며 도와주며 최대한으로 좋은 결과물을 만들어내기 위해 모두가 노력하는 과정이 즐거웠습니다. 생각보다 많은 시간이 소요되었지만 그만큼 많은 걸 얻을 수 있었고 특히 깃허브를 통한 협업이 처음에는 정말 어려웠지만 팀원들과 방법을 공유하며 협업에 익숙해질 수 있어서 좋았습니다. 그리고 팀 프로젝트에서 정말 좋은 팀원들을 만나서 부트캠프 끝난 이후에도 끝까지 함께 할 수 있었던 것이 가장 좋았고 함께 할 수 있어서 너무 좋았고 모두 고생했다고 전하고 싶습니다😊
<br/>

### 김상우

<br/>

### 이재호

<br/>

### 하지혜

<br/>

<a href="https://github.com/jihyezi/StudyBuddy"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fjihyezi%2FStudyBuddy&count_bg=%23555555&title_bg=%23555555&icon=github.svg&icon_color=%23E7E7E7&title=GitHub&edge_flat=false"/></a>
