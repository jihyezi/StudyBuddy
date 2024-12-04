// searchHistory.jsx

import { v4 as uuidv4 } from "uuid"; // UUID 생성 라이브러리
import supabase from "components/supabaseClient";

export const fetchSearchHistory = async (userId) => {
  if (!userId) {
    console.error("Error: userId is undefined");
    return [];
  }

  const { data, error } = await supabase
    .from("SearchHistory")
    .select("*")
    .eq("userid", userId) // 필드 이름 확인
    .order("createdat", { ascending: false }); // 필드 이름 확인

  if (error) {
    console.error("Error fetching search history:", error);
    return [];
  }

  return data;
};

export const addSearchHistory = async (userId, query) => {
  if (!userId) {
    console.error("Error: userId is undefined");
    return null;
  }

  const searchId = uuidv4(); // 고유한 searchId 생성

  const { data, error } = await supabase
    .from("SearchHistory")
    .insert([{ searchid: searchId, userid: userId, query }]); // 필드 이름 확인

  if (error) {
    console.error("Error adding search history:", error);
    return null;
  }

  return data;
};

export const deleteSearchHistory = async (searchId) => {
  if (!searchId) {
    console.error("Error: searchId is undefined");
    return null;
  }

  const { data, error } = await supabase
    .from("SearchHistory")
    .delete()
    .eq("searchid", searchId); // 필드 이름 확인

  if (error) {
    console.error("Error deleting search history:", error);
    return null;
  }

  return data;
};
