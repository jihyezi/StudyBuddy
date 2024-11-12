import { useQuery } from "@tanstack/react-query";
import supabase from "components/supabaseClient";

const fetchPostsUsersAndCommunities = async (query) => {
  const { data: postsData, error: postsError } = await supabase
    .from("Post")
    .select("*")
    .ilike("title", `%${query}%`);

  if (postsError) throw new Error("Error fetching posts");

  if (!postsData || postsData.length === 0) {
    return { postsData: [], usersData: [], communityData: [], commentData: [] };
  }

  const userIds = postsData.map((post) => post.userid);
  const { data: usersData, error: usersError } = await supabase
    .from("User")
    .select("*")
    .in("userid", userIds);

  if (usersError) throw new Error("Error fetching users");

  const communityIds = postsData.map((post) => post.communityid);
  const { data: communityData, error: communityError } = await supabase
    .from("Community")
    .select("*")
    .in("communityid", communityIds);

  if (communityError) throw new Error("Error fetching communities");

  const allComments = await Promise.all(
    postsData.map(async (post) => {
      const { data: comments, error: commentsError } = await supabase
        .from("Comment")
        .select("*")
        .eq("postid", post.postid);

      if (commentsError)
        console.error("Error fetching comments:", commentsError);

      return comments || [];
    })
  );

  return { postsData, usersData, communityData, allComments };
};

const usePostsAndUsers = (query) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["postsUsersCommunities", query],
    queryFn: () => fetchPostsUsersAndCommunities(query),
    staleTime: 5 * 60 * 1000, // 데이터가 5분 동안 신선하게 유지됨
    cacheTime: 10 * 60 * 1000, // 캐시는 10분간 유지 후 자동 삭제
    refetchOnWindowFocus: false, // 사용자가 탭을 재방문해도 자동 리패칭하지 않음
  });

  // 데이터 존재 여부 확인 후 필요한 값 반환
  const posts = data?.postsData || [];
  const users = data?.usersData || [];
  const communityInfo = data?.communityData || [];
  const commentData = data?.allComments || [];

  // 사용자 매핑
  const userMap = Object.fromEntries(users.map((user) => [user.userid, user]));

  return {
    posts,
    users: userMap,
    allUserData: users,
    communityInfo,
    commentData,
    isLoading,
    error,
  };
};

export default usePostsAndUsers;
