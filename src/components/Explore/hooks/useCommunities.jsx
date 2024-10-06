import { useEffect, useState } from "react";
import { fetchCommunities } from "../communityData";

const useCommunities = (query) => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const getCommunities = async () => {
      const data = await fetchCommunities(query);
      setCommunities(data);
    };

    getCommunities();
  }, [query]);

  return communities;
};

export default useCommunities;
