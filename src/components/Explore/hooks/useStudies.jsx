import { useQuery } from "@tanstack/react-query";
import supabase from "components/supabaseClient";

// 각 데이터를 가져오는 함수들
const fetchStudiesData = async (query) => {
  const { data: studiesData, error: studiesError } = await supabase
    .from("Study")
    .select("*")
    .ilike("title", `%${query}%`);

  if (studiesError) throw new Error("Error fetching studies");

  return studiesData || [];
};

const fetchLikesCount = async (studyIds) => {
  const { data: likesData, error: likesError } = await supabase
    .from("studylikescount")
    .select("*")
    .in("studyid", studyIds);

  if (likesError) throw new Error("Error fetching likes count");

  const likesMap = likesData.reduce((map, item) => {
    map[item.studyid] = item.like_count;
    return map;
  }, {});

  return likesMap;
};

const fetchCommentsCount = async (studyIds) => {
  const { data: commentsData, error: commentsError } = await supabase
    .from("studycommentscount")
    .select("*")
    .in("studyid", studyIds);

  if (commentsError) throw new Error("Error fetching comments count");

  const commentsMap = commentsData.reduce((map, item) => {
    map[item.studyid] = item.comment_count;
    return map;
  }, {});

  return commentsMap;
};

// 주 훅
const useStudies = (query) => {
  const {
    data: studies,
    isLoading: studiesLoading,
    error: studiesError,
  } = useQuery({
    queryKey: ["studies", query], // 쿼리 키와 쿼리 함수를 객체 형태로 전달
    queryFn: () => fetchStudiesData(query),
    enabled: !!query, // query가 있을 때만 실행
  });

  const studyIds = studies?.map((study) => study.studyid) || [];

  const { data: likesCount, isLoading: likesLoading } = useQuery({
    queryKey: ["likesCount", studyIds],
    queryFn: () => fetchLikesCount(studyIds),
    enabled: studyIds.length > 0,
  });

  const { data: commentsCount, isLoading: commentsLoading } = useQuery({
    queryKey: ["commentsCount", studyIds],
    queryFn: () => fetchCommentsCount(studyIds),
    enabled: studyIds.length > 0,
  });

  if (studiesLoading || likesLoading || commentsLoading) {
    return { studies: [], likesCount: {}, commentsCount: {}, isLoading: true };
  }

  if (studiesError) {
    console.error("Error fetching studies:", studiesError);
    return { studies: [], likesCount: {}, commentsCount: {}, isLoading: false };
  }

  return { studies, likesCount, commentsCount, isLoading: false };
};

export default useStudies;
