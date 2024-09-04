import supabase from "components/supabaseClient";

export const selectList = {
  classifications: [
    { name: "사업관리" },
    { name: "경영/회계/사무" },
    { name: "금융/보험" },
    { name: "교육/자연/과학/사회과학" },
    { name: "법률/경찰/소방/교도/국방" },
    { name: "보건/의료" },
    { name: "사회복지/종교" },
    { name: "문화/예술/디자인/방송" },
    { name: "운전/운송" },
    { name: "영업/판매" },
    { name: "경비/청소" },
    { name: "이용/숙박/여행/오락/스포츠" },
    { name: "음식서비스" },
    { name: "건설" },
    { name: "광업자원" },
    { name: "기계" },
    { name: "재료" },
    { name: "화학" },
    { name: "섬유/의복" },
    { name: "전기/전자" },
    { name: "정보통신" },
    { name: "식품/가공" },
    { name: "인쇄/목재/가구/공예" },
    { name: "농림어업" },
    { name: "안전관리" },
    { name: "환경/에너지" },
  ],
  proceed: [{ name: "온라인" }, { name: "오프라인" }],
  people: [
    { name: "인원 미정" },
    { name: "1명" },
    { name: "2명" },
    { name: "3명" },
    { name: "4명" },
    { name: "5명" },
    { name: "6명" },
    { name: "7명" },
    { name: "8명" },
    { name: "9명" },
    { name: "10명 이상" },
  ],
  period: [
    { name: "기간 미정" },
    { name: "1개월" },
    { name: "2개월" },
    { name: "3개월" },
    { name: "4개월" },
    { name: "5개월" },
    { name: "6개월 이상" },
    { name: "1년 이상" },
  ],
  joinCommunity: [],
};

export const fetchCommunityData = async (communityIds) => {
  const { data, error } = await supabase
    .from("Community")
    .select("name, communityid");

  if (error) {
    console.error("Error fetching community data:", error);
    return;
  }

  selectList.joinCommunity =
    data
      .filter((item) => communityIds.includes(item.communityid))
      .map((item) => ({
        name: item.name,
        communityId: item.communityid,
      })) || [];
};

export const fetchJoinCommunityData = async () => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error getting session:", sessionError);
    return;
  }

  const userId = session.user.id;

  const { data, error } = await supabase
    .from("JoinCommunity")
    .select("communityid")
    .eq("userid", userId);

  if (error) {
    console.error("Error fetching community data:", error);
    return;
  }

  const communityIds = data.map((item) => item.communityid);
  await fetchCommunityData(communityIds);
};

fetchJoinCommunityData();
