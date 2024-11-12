import React, { createContext, useContext } from "react";
import {
  useAllUserData,
  useUserData,
  useCommunityData,
  usePostData,
  useStudyData,
} from "./CommonApi";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const {
    data: allUserData,
    isLoading: isAllUserDataLoading,
    error: allUserDataError,
  } = useAllUserData();
  const {
    data: userData,
    isLoading: isUserDataLoading,
    error: userDataError,
    refetch: refetchUserData,
  } = useUserData();
  const {
    data: communityData,
    isLoading: isCommunityDataLoading,
    error: communityDataError,
  } = useCommunityData();
  const {
    data: postData,
    isLoading: isPostDataLoading,
    error: postDataError,
  } = usePostData();
  const {
    data: studyData,
    isLoading: isStudyDataLoading,
    error: studyDataError,
  } = useStudyData();

  const isLoading =
    isAllUserDataLoading ||
    isUserDataLoading ||
    isCommunityDataLoading ||
    isPostDataLoading ||
    isStudyDataLoading;
  const hasError =
    allUserDataError ||
    userDataError ||
    communityDataError ||
    postDataError ||
    studyDataError;

  return (
    <DataContext.Provider
      value={{
        allUserData,
        userData,
        communityData,
        postData,
        studyData,
        refetchUserData,
        isLoading,
        hasError,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  return useContext(DataContext);
};
