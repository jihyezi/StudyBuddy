import { useQuery } from "@tanstack/react-query";
import { fetchCommunities } from "../communityData";
import { useEffect } from "react";

const useCommunities = (query) => {
  const { data } = useQuery({
    queryKey: ["communities", query], // 쿼리 키: query 값에 따라 캐시가 구분됨
    queryFn: () => fetchCommunities(query), // 데이터를 가져오는 함수
    staleTime: 5 * 60 * 1000, // 데이터가 5분 동안 신선하게 유지됨
    cacheTime: 10 * 60 * 1000, // 캐시는 10분간 유지 후 자동 삭제
    refetchOnWindowFocus: false, // 사용자가 탭을 재방문해도 자동 리패칭하지 않음
  });
  // console.log(data, 111111111111);

  // data만 반환하도록 수정하여 첫 번째 코드와 동일하게 배열을 반환
  return data || [];
};

export default useCommunities;
