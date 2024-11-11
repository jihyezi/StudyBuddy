import supabase from 'components/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from 'contexts/AuthContext';

export const fetchAllUserData = async () => {
    const { data, error } = await supabase
        .from('User')
        .select('*');

    if (error) throw new Error('Faled to fetch user data');
    return data;
}

export const useAllUserData = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['allUserData'],
        queryFn: fetchAllUserData,
        onError: (error) => console.log(error.message),
    });

    return { data, isLoading, error }
}

export const fetchUserData = async (userId) => {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('userid', userId)
        .single();

    if (error) throw new Error('Faled to fetch user data');
    return data;
}

export const useUserData = () => {
    const { user: sessionUser } = useAuth();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['userData', sessionUser?.id],
        queryFn: () => fetchUserData(sessionUser.id),
        enabled: !!sessionUser,
        onError: (error) => console.error(error.message),
    });

    return { data, isLoading, error, refetch };
}

export const fetchCommunityData = async () => {
    const { data, error } = await supabase
        .from('Community')
        .select('*');

    if (error) throw new Error('Faled to fetch user data');
    return data;
}

export const useCommunityData = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['communityData'],
        queryFn: fetchCommunityData,
        onError: (error) => console.log(error.message),
    });

    return { data, isLoading, error, refetch }
}

export const fetchPostData = async () => {
    const { data, error } = await supabase
        .from('Post')
        .select('*');

    if (error) throw new Error('Faled to fetch user data');
    return data;
}

export const usePostData = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['postData'],
        queryFn: fetchPostData,
        onError: (error) => console.log(error.message),
    });

    return { data, isLoading, error }
}