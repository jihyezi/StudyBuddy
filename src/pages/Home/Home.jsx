import React, { useState } from "react";
import styles from "./Home.module.css";

// sclick
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// component
import HotCommunity from "components/Home/HotCommunity";
import PopularPost from "components/Home/PopularPost";
import RecentCommunity from "components/Home/RecentCommunity";
import PopularStudy from "components/Home/PopularStudy";
import HomeImage from "assets/images/Home/OnBoardingImage1.png";
import leftarrow from "assets/icons/Home/leftarrow.png";
import rightarrow from "assets/icons/Home/rightarrow.png";
import downarrow from "assets/icons/Home/downarrow.png";
import LoginModal from "components/Home/LoginModal"; // 모달

import onboardingimg from "assets/images/Home/OnBoarding.png";
import Classification from "components/Communities/Classification";
import Tag from "components/Home/Tag";

const Home = ({ }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [selectedEvent, setSelectEvent] = useState('');


  const handleEventSelect = (event) => {
    setSelectEvent(event);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
    appendDots: (dots) => (
      <div
        style={{
          display: 'flex',
          position: "absolute",
          width: "80px",
          height: "32px",
          top: 240,
          left: 80,
          borderRadius: "8px",
          opacity: "0px",
          backgroundColor: "#FFF",
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ul
          style={{
            display: "flex",
            padding: 0,
            margin: 0,
            gap: "3px",
            alignItems: 'center',
            justifyContent: 'center',
            listStyleType: "none" // 기본 리스트 스타일 제거
          }}
        >
          {dots.map((dot, index) => (
            <li key={index} style={{ display: 'flex', margin: "0 3px", width: "6px", height: "6px", justifyContent: 'center' }}>
              {dot}
            </li>
          ))}
        </ul>
      </div >
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "6px",
          height: "6px",
          backgroundColor: i === currentSlide ? "#FF7474" : "#9c9c9c",
          // border: i === currentSlide ? "4px solid #fcc6c6" : "none",
          borderRadius: "50%",
        }}
      />
    ),
  };

  return (
    <div className={styles.home}>
      <Slider
        {...settings}
        style={{ display: "grid" }}

      >
        <img src={onboardingimg} />
        <img src={onboardingimg} />
        <img src={onboardingimg} />
        <img src={onboardingimg} />
      </Slider>
      <div style={{ borderBottom: "1px solid #ddd", padding: '30px 0px' }}>

        <div
          style={{
            position: "relative",
            paddingLeft: 40
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              position: "relative",
              marginBottom: 28,
              fontFamily: 'Manrope-Bold'
            }}
          >
            🔥 HOT 커뮤니티
          </div>
          <div
            className={styles.scrollContainer}
            style={{
              position: "relative",
            }}
          >
            <div className={styles.hotCommunityItem}>
              <HotCommunity />
              <HotCommunity />
              <HotCommunity />
            </div>
            {/* 필요한 만큼 HotCommunity 컴포넌트 추가 */}
          </div>
        </div>
      </div>
      {/*  */}
      <div
        style={{
          borderBottom: "1px solid #ddd",
          padding: '30px 0px'
          // position: "fixed",
        }}
      >
        <div
          style={{
            position: "relative",
            paddingLeft: 40
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              position: "relative",
              marginBottom: 28,
              fontFamily: 'Manrope-Bold'
            }}
          >
            ⭐️ 인기글
          </div>
          <div
            className={styles.scrollContainer}
            style={{
              position: "relative",
              width: '100%',
            }}
          >
            <div className={styles.hotCommunityItem}>
              <PopularPost />
              <PopularPost />
              <PopularPost />
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      <div style={{ borderBottom: "1px solid #ddd", padding: '30px 0px' }}>
        <div
          style={{
            position: "relative",
            paddingLeft: 40
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              position: "relative",
              marginBottom: 28,
              fontFamily: 'Manrope-Bold'
            }}
          >
            최근 방문한 커뮤니티
          </div>
          <div
            className={styles.scrollContainer}
            style={{
              position: "relative",
              width: '100%',
            }}
          >
            <div className={styles.newSearch}>
              <RecentCommunity />
              <RecentCommunity />
              <RecentCommunity />
              <RecentCommunity />
            </div>
          </div>
        </div>
      </div>
      {/*  react slick 캐러셀  만들기*/}
      <div style={{ padding: '30px 0px' }}>
        <div
          style={{
            position: "relative",
            padding: '0px 40px'
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              position: "relative",
              marginBottom: 28,
              fontFamily: 'Manrope-Bold'
            }}
          >
            태그별 인기 스터디 🤗
          </div>

          <div
            style={{
              position: "relative",
              width: '100%',
              alignItems: 'center',
            }}
          >

            <Tag onEventSelect={handleEventSelect} />
            <div className={styles.popularStudy}>
              <PopularStudy />
              <PopularStudy />
              <PopularStudy />
            </div>
            {/* <div
              style={{
                display: "flex",
                flexDirection: "row",
                maxWidth: 1020,
                alignItems: "center",
                justifyContent: "space-between", // Space out the elements
              }}
            >
              <img src={leftarrow} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px", // 버튼 간의 간격 설정
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                <button
                  style={{
                    padding: "4px 7px",
                    borderRadius: 8,
                    backgroundColor: "#FF74741F",
                    fontWeight: 400,
                    fontSize: 20,
                    color: "#FF7474",
                    border: "1px solid #FFF",
                    width: 122,
                    height: 43,
                  }}
                >
                  Technology
                </button>
                <button
                  style={{
                    padding: "4px 7px",
                    borderRadius: 8,
                    backgroundColor: "#0000",
                    fontWeight: 400,
                    fontSize: 20,
                    color: "#9c9c9c",
                    border: "1px solid #DDD",
                    width: 76,
                    height: 43,
                  }}
                >
                  Sports
                </button>
                <button
                  style={{
                    padding: "4px 7px",
                    borderRadius: 8,
                    backgroundColor: "#0000",
                    fontWeight: 400,
                    fontSize: 20,
                    color: "#9c9c9c",
                    border: "1px solid #DDD",
                    width: 42,
                    height: 43,
                  }}
                >
                  Art
                </button>
                <button
                  style={{
                    padding: "4px 7px",
                    borderRadius: 8,
                    backgroundColor: "#0000",
                    fontWeight: 400,
                    fontSize: 20,
                    color: "#9c9c9c",
                    border: "1px solid #DDD",
                    width: 148,
                    height: 43,
                  }}
                >
                  Entertainment
                </button>
              </div>
              <img src={rightarrow} />
            </div>
            <div className={styles.hotCommunityItem}>
              <PopularStudy />
            </div>
            <div
              style={{
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                style={{
                  width: 134,
                  height: 43,
                  borderRadius: 12,
                  backgroundColor: "#FFF",
                  padding: "10px 20px",
                  border: "1px solid #9c9c9c",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#9c9c9c",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                more <img src={downarrow} />
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <LoginModal />
    </div>
  );
};

export default Home;
