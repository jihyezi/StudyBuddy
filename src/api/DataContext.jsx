import React, { createContext, useContext } from "react";
import { useAllUserData, useUserData, useCommunityData, usePostData } from "./CommonApi";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { data: allUserData, isLoading: isAllUserDataLoading, error: allUserDataError } = useAllUserData();
    const { data: userData, isLoading: isUserDataLoading, error: userDataError } = useUserData();
    const { data: communityData, isLoading: isCommunityDataLoading, error: communityDataError } = useCommunityData();
    const { data: postData, isLoading: isPostDataLoading, error: postDataError } = usePostData();

    const isLoading = isAllUserDataLoading || isUserDataLoading || isCommunityDataLoading || isPostDataLoading;
    const hasError = allUserDataError || userDataError || communityDataError || postDataError;

    return (
        <DataContext.Provider value={{
            allUserData,
            userData,
            communityData,
            postData,
            isLoading,
            hasError,
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    return useContext(DataContext);
};
