import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import styles from './Profile.module.css';
import supabase from "components/supabaseClient";

// Components
import Header from "components/Header";
import ProfileTablist from "components/Profile/ProfileTablist";
import ProfileEditModal from "components/Profile/ProfileEditModal";

// Images
import nobackground from "assets/images/Profile/nobackground.png";
import noprofile from "assets/images/Profile/noprofile.png";
import loadinggif from "assets/images/loading.gif"

const OtherProfile = () => {
    const location = useLocation();
    const { communityData, postData, userData } = location.state || {};
    const communityInfo = { communityData, postData, userData };
    const { user: sessionUser } = useAuth(); // 현재 로그인된 유저 정보 가져오기
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const [allUser, setAllUser] = useState([]);
    const [community, setCommunity] = useState([]);
    const [post, setPost] = useState([]);
    const [userPost, setUserPost] = useState([]);
    const [comment, setComment] = useState([]);
    const [userComment, setUserComment] = useState([]);
    const [userLike, setUserLike] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (sessionUser) {
                const { data, error } = await supabase
                    .from("User")
                    .select("*")
                    .eq("userid", sessionUser.id);

                if (error) {
                    console.error("Error fetching user data:", error);
                } else {
                    setUser(data);
                    setUserInfo(data[0]);
                }
            }
        };

        const fetchAllUserData = async () => {
            const { data, error } = await supabase.from("User").select("*");

            if (error) {
                console.error("Error", error);
            } else {
                setAllUser(data);
            }
        };

        const fetchCommunityData = async () => {
            if (sessionUser) {
                const { data, error } = await supabase.from("Community").select("*");

                if (error) {
                    console.error("Error", error);
                } else {
                    setCommunity(data);
                }
            }
        };

        const fetchPostData = async () => {
            if (sessionUser) {
                const { data, error } = await supabase.from("Post").select("*");

                if (error) {
                    console.error("Error", error);
                } else {
                    setPost(data);
                }
            }
        };

        const fetchUserPostData = async () => {
            if (sessionUser) {
                const { data, error } = await supabase.from("Post").select("*").eq('userid', userData.userid);

                if (error) {
                    console.error("Error", error);
                } else {
                    setUserPost(data);
                }
            }
        };

        const fetchCommentData = async () => {
            if (sessionUser) {
                const { data, error } = await supabase
                    .from("Comment")
                    .select("*");

                if (error) {
                    console.error("Error", error);
                } else {
                    setComment(data);
                }
            } else {
                console.warn("postid가 정의되지 않았습니다.");
            }
        };

        const fetchUserCommentData = async () => {
            if (sessionUser) {
                const { data, error } = await supabase
                    .from("Comment")
                    .select("*")
                    .eq("userid", userData.userid);

                if (error) {
                    console.error("Error", error);
                } else {
                    setUserComment(data);
                }
            } else {
                console.warn("postid가 정의되지 않았습니다.");
            }
        };

        const fetchUserLikeData = async () => {
            if (sessionUser) {
                const { data, error } = await supabase.from("PostLike").select("postid").eq('userid', userData.userid);

                if (error) {
                    console.error("Error", error);
                } else {
                    setUserLike(data);
                }
                setLoading(false);
            }
        };



        fetchUserData();
        fetchAllUserData();
        fetchCommunityData();
        fetchPostData();
        fetchUserPostData();
        fetchCommentData();
        fetchUserCommentData();
        fetchUserLikeData();
    }, [sessionUser, userData]);

    if (loading) {
        return <div style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}><img src={loadinggif} style={{ width: '80px' }} /></div>;
    }

    if (!sessionUser) {
        return <div> </div>;
    }

    if (!user) {
        return <div>User data not found.</div>;
    }

    const filterLikePost = post.filter((postItem) =>
        userLike.some((likeItem) => likeItem.postid === postItem.postid)
    );

    const filterCommentPost = post.filter((postItem) =>
        userComment.some((likeItem) => likeItem.postid === postItem.postid)
    );

    return (
        <div className={styles.container}>
            <Header headerName={userData.nickname} />
            {loading ? (
                <div style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={loadinggif} style={{ width: '80px' }} alt="Loading" />
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div className={styles.info}>
                        <div className={styles.imageWrapper}>
                            {userData.backgroundimage ?
                                <img src={userData.backgroundimage} alt="profile background" className={styles.image} />
                                : <img src={nobackground} alt="profile background" className={styles.image} />
                            }
                            <div className={styles.profileImgContainer}>
                                {userData.profileimage ?
                                    <img src={userData.profileimage} alt="profile" className={styles.profileImg} />
                                    : <img src={noprofile} alt="profile" className={styles.profileImg} />
                                }

                            </div>
                        </div>

                        <div className={styles.details}>
                            <div className={styles.edit}>
                                <div className={styles.communityName}>{communityInfo.community}</div>
                                <button className={styles.joinButton} onClick={openModal}>
                                    Edit
                                </button>
                                <ProfileEditModal
                                    modalIsOpen={modalIsOpen}
                                    closeModal={closeModal}
                                    profileImg={userData.profileimage}
                                    backgroundimage={userData.backgroundimage}
                                    userData={userData}
                                    userNickname={userData.nickname}
                                />
                            </div>
                            <div className={styles.infoList}>
                                <span className={styles.description1}>{userData.nickname}</span>
                                <span className={styles.description2}>@{userData.username}</span>
                                <span className={styles.description3}>{userData.bio}</span>
                                <span className={styles.description4}>🎂 {userData.birthdate}</span>
                            </div>
                        </div>
                        <ProfileTablist
                            post={post}
                            community={community}
                            user={userData}
                            allUser={allUser}
                            comment={comment}
                            userPost={userPost}
                            userLike={filterLikePost}
                            userComment={filterCommentPost} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default OtherProfile;