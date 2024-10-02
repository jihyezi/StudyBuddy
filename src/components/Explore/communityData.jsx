import supabase from "../supabaseClient";

// 커뮤니티 데이터 가져오기 함수
export const fetchCommunities = async (query) => {
  const { data, error } = await supabase.rpc("get_community_counts", { query });

  if (error) {
    console.error("Error fetching communities:", error);
    return [];
  }

  return data;
};
