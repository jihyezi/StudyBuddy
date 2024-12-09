import React from "react";
import styles from "./CommunityContainer.module.css";
import "fonts/Font.css";

// image & icon
import bookmark from "assets/icons/Home/bookmark.png";
import CommunityField from "components/Communities/CommunityField";
import person from "assets/icons/person.png";
import logo from "assets/images/Communities/whitelogo.png"

const CommunityContainer = ({ community, communityData, onClick }) => {

    return (
        <div className={styles.community} onClick={onClick}>
            <div className={styles.communityInfo}>
                <div className={styles.classificationIcon}>
                    <img className={styles.bookmarkIcon} src={bookmark} alt="bookmark" />
                    <CommunityField field={communityData?.field} />
                </div>

                <div>
                    <img src={community.image ? community?.image : logo} className={styles.communityImage} />
                </div>

                <div className={styles.communityNameContainer}>
                    <p className={styles.communityName}>
                        {community?.name}
                    </p>
                </div>

                <div className={styles.communityDetailContent}>
                    {community?.description}
                </div>
            </div>


            <div className={styles.communityDetail}>
                <img src={person} style={{ width: '20px' }} />
                <span className={styles.communityDetailContent}>
                    {community?.member_count}명
                </span>
            </div>

        </div>
    );
};

export default CommunityContainer;
