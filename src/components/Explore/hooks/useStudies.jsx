import { useEffect, useState } from "react";
import supabase from "components/supabaseClient";

const useStudies = (query) => {
  const [studies, setStudies] = useState([]);
  const [likesCount, setLikesCount] = useState({});
  const [commentsCount, setCommentsCount] = useState({});

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const { data: studiesData, error: studiesError } = await supabase
          .from("Study")
          .select("*")
          .ilike("title", `%${query}%`);

        if (studiesError) {
          console.error("Error fetching studies:", studiesError);
          return;
        }

        setStudies(studiesData);
        fetchLikesCount(studiesData.map((study) => study.studyid));
        fetchCommentsCount(studiesData.map((study) => study.studyid));
      } catch (error) {
        console.error("Error fetching studies:", error);
      }
    };

    fetchStudies();
  }, [query]);

  const fetchLikesCount = async (studyIds) => {
    try {
      const { data: likesData, error: likesError } = await supabase
        .from("studylikescount")
        .select("*")
        .in("studyid", studyIds);

      if (likesError) {
        console.error("Error fetching likes count:", likesError);
        return;
      }

      const likesMap = {};
      likesData.forEach((item) => {
        likesMap[item.studyid] = item.like_count;
      });
      setLikesCount(likesMap);
    } catch (error) {
      console.error("Error fetching likes count:", error);
    }
  };

  const fetchCommentsCount = async (studyIds) => {
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from("studycommentscount")
        .select("*")
        .in("studyid", studyIds);

      if (commentsError) {
        console.error("Error fetching comments count:", commentsError);
        return;
      }

      const commentsMap = {};
      commentsData.forEach((item) => {
        commentsMap[item.studyid] = item.comment_count;
      });
      setCommentsCount(commentsMap);
    } catch (error) {
      console.error("Error fetching comments count:", error);
    }
  };

  return { studies, likesCount, commentsCount };
};

export default useStudies;
