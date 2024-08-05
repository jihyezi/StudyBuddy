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

const Home = ({}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
          position: "absolute",
          width: "140px",
          height: "39px",
          top: "93%",
          left: 150,
          borderRadius: "8px",
          opacity: "0px",
          backgroundColor: "#FFF",
        }}
      >
        <ul
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0",
          }}
        >
          {dots}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "20px",
          height: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
        style={{ backgroundColor: "#FF74741A", position: "relative" }}
      >
        <div
          style={{
            position: "relative",
            backgroundColor: "#FF74741A",
          }}
        >
          <div className={styles.SliderText}>
            시험 준비나 학습에 도움이 되는 자료를 업로드하고 공유해 보세요📕
          </div>
          <img
            src={HomeImage}
            style={{
              position: "relative",
              width: 279.35,
              height: 230,
              top: -50,
              left: "70%",
            }}
          />
        </div>
        <div className={styles.SliderText}>2</div>
        <div className={styles.SliderText}>3</div>
        <div className={styles.SliderText}>4</div>
      </Slider>

      {/* dddddddddddddddddddddddddddddddddddd */}
      <div style={{ borderBottom: "1px solid #ddd", height: 302 }}>
        <div
          style={{
            position: "relative",
            left: 40,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              position: "relative",
              top: 45,
              left: 40,
            }}
          >
            Hot한 커뮤니티
          </div>
          <div
            className={styles.scrollContainer}
            style={{
              position: "relative",
              top: 79,
              left: 40,
              width: 1115,
              maxWidth: 1115,
            }}
          >
            <div className={styles.hotCommunityItem}>
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
          height: 237,
          // position: "fixed",
        }}
      >
        <div
          style={{
            position: "relative",
            left: 40,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              position: "relative",
              top: 35,
              left: 40,
            }}
          >
            🔥인기글
          </div>
          <div
            className={styles.scrollContainer}
            style={{
              position: "relative",
              top: 60,
              left: 40,
              width: 1115,
              maxWidth: 1115,
            }}
          >
            <div className={styles.hotCommunityItem}>
              <PopularPost />
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      <div style={{ borderBottom: "1px solid #ddd", height: 400 }}>
        <div
          style={{
            position: "relative",
            left: 40,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              position: "relative",
              top: 35,
              left: 40,
            }}
          >
            최근 방문한 커뮤니티
          </div>
          <div
            className={styles.scrollContainer}
            style={{
              position: "relative",
              top: 60,
              left: 40,
              width: 1115,
              maxWidth: 1115,
            }}
          >
            <div className={styles.hotCommunityItem}>
              <RecentCommunity />
            </div>
          </div>
        </div>
      </div>
      {/*  react slick 캐러셀  만들기*/}
      <div>
        <div
          style={{
            position: "relative",
            left: 40,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              position: "relative",
              top: 35,
              left: 40,
            }}
          >
            태그별 인기 스터디
          </div>

          <div
            style={{
              position: "relative",
              top: 60,
              left: 40,
              width: 1115,
              maxWidth: 1115,
            }}
          >
            <div
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
            </div>
          </div>
        </div>
      </div>
      <LoginModal />
    </div>
  );
};

export default Home;
