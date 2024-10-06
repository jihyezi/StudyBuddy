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
          return;
        }

        const userIds = postsData.map((post) => post.userid);
        const { data: usersData, error: usersError } = await supabase
          .from("User")
          .select("*")
          .in("userid", userIds);

        const communityIds = postsData.map((post) => post.communityid);
        const { data: communityData, error: communityError } = await supabase
          .from("Community")
          .select("*")
          .in("communityid", communityIds);

        const allComments = await Promise.all(
          postsData.map(async (post) => {
            const { data: comments } = await supabase
              .from("Comment")
              .select("*")
              .eq("postid", post.postid);
            return comments || [];
          })
        );

        setPosts(postsData);
        setUsers(usersData);
        setCommunityInfo(communityData);
        setCommentData(allComments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPostsUsersAndCommunities();
  }, [query]);

  return { posts, users, communityInfo, commentData };
};

export default usePostsAndUsers;
