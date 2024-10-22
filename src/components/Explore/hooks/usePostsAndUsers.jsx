import { useEffect, useState } from "react";
import supabase from "components/supabaseClient";

const usePostsAndUsers = (query) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [communityInfo, setCommunityInfo] = useState([]);
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    const fetchPostsUsersAndCommunities = async () => {
      try {
        const { data: postsData, error: postsError } = await supabase
          .from("Post")
          .select("*")
          .ilike("title", `%${query}%`);

        if (postsError) {
          console.error("Error fetching posts:", postsError);
          return;
        }

        if (!postsData || postsData.length === 0) {
          setPosts([]);
          setUsers([]); // 사용자 데이터도 초기화
          return;
        }

        const userIds = postsData.map((post) => post.userid);
        const { data: usersData, error: usersError } = await supabase
          .from("User")
          .select("*")
          .in("userid", userIds);

        if (usersError) {
          console.error("Error fetching users:", usersError);
          return;
        }

        const communityIds = postsData.map((post) => post.communityid);
        const { data: communityData, error: communityError } = await supabase
          .from("Community")
          .select("*")
          .in("communityid", communityIds);

        if (communityError) {
          console.error("Error fetching communities:", communityError);
          return;
        }

        const allComments = await Promise.all(
          postsData.map(async (post) => {
            const { data: comments, error: commentsError } = await supabase
              .from("Comment")
              .select("*")
              .eq("postid", post.postid);

            if (commentsError) {
              console.error("Error fetching comments:", commentsError);
            }

            return comments || [];
          })
        );

        setPosts(postsData);
        setUsers(usersData || []); // 사용자 데이터가 없으면 빈 배열로 설정
        setCommunityInfo(communityData || []);
        setCommentData(allComments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPostsUsersAndCommunities();
  }, [query]);

  // 사용자 매핑
  const userMap = Object.fromEntries(users.map((user) => [user.userid, user]));

  return {
    posts,
    users: userMap,
    allUserData: users,
    communityInfo,
    commentData,
  }; // allUserData 추가
};

export default usePostsAndUsers;
