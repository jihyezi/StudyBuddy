import React, { useState, useCallback, useMemo } from "react";
import styles from "./AddCommunity.module.css";
import supabase from "components/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDataContext } from "api/DataContext";

// components & image
import Header from "components/Header";
import CommunityContainer from "components/Communities/CommunityContainer";
import Classification from "components/Communities/Classification";
import loadinggif from "assets/images/loading.gif";

const fetchHotCommunities = async () => {
    const { data, error } = await supabase
        .from("hot_communities")
        .select("*")
        .order("member_count", { ascending: false });

    if (error) {
        throw new Error("Error fetching hot communities:", error.message);
    }

    return data;
};

const AddCommunity = () => {
    const { communityData, userData } = useDataContext();
    const [selectedEvent, setSelectEvent] = useState("");
    const navigate = useNavigate();

    const { data: hotCommunities, isLoading } = useQuery({
        queryKey: ["hotCimmunities"],
        queryFn: fetchHotCommunities
    });

    const handleEventSelect = useCallback((event) => {
        setSelectEvent(event);
    }, []);

    const handleCommuntiyClick = (community) => {
        navigate(`/detail-community/${community.communityid}`, {
            state: {
                communityData: communityData,
                userData: userData,
            },
        });
    };

    const hotFilteredCommunities = useMemo(() => {
        if (!communityData || !hotCommunities) return [];
        const hotCommunityIds = hotCommunities.map((hc) => hc.communityid);
        return communityData.filter((c) => hotCommunityIds.includes(c.communityid));
    }, [communityData, hotCommunities]);

    const filterfieldCommunity = useMemo(() => {
        if (!communityData) return [];
        if (selectedEvent === "🔥") {
            return hotFilteredCommunities;
        }
        return communityData.filter((p) => p.field === selectedEvent);
    }, [communityData, selectedEvent, hotFilteredCommunities]);

    const enrichedCommunityData = useMemo(() => {
        return filterfieldCommunity.map((community) => {
            const hotCommunity = hotCommunities?.find(
                (hc) => hc.communityid === community.communityid
            );
            return {
                ...community,
                member_count: hotCommunity ? hotCommunity.member_count : null,
            };
        });
    }, [filterfieldCommunity, hotCommunities]);

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100vh",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img src={loadinggif} style={{ width: "80px" }} alt="Loading" />
            </div>
        )
    };

    return (
        <div className={styles.communityContainer}>
            <Header headerName={"AllCommunities"} />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div className={styles.MainContainer} >
                    <Classification onEventSelect={handleEventSelect} />

                    {enrichedCommunityData && enrichedCommunityData.length > 0 ? (
                        <div className={styles.communityMap}>
                            {enrichedCommunityData.map((community, index) => (
                                <CommunityContainer
                                    key={community.id || index}
                                    community={community}
                                    communityData={communityData[index]}
                                    onClick={() => handleCommuntiyClick(community)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noPostContainer}>
                            <div className={styles.noPost}>No Community Yet.</div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    )
}

export default AddCommunity;