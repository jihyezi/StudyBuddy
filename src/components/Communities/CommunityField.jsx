import React from "react";
import styles from '../../pages/Communities/CommunityDetailsPage.module.css'

// icons
import business from 'assets/icons/Field/business.png';
import finance from 'assets/icons/Field/finance.png';
import education from 'assets/icons/Field/education.png';
import law from 'assets/icons/Field/law.png';
import medical from 'assets/icons/Field/medical.png';
import religion from 'assets/icons/Field/religion.png';
import palette from 'assets/icons/Field/palette.png';
import operation from 'assets/icons/Field/operation.png';
import sales from 'assets/icons/Field/sales.png';
import security from 'assets/icons/Field/security.png';
import stay from 'assets/icons/Field/stay.png';
import foodprocessing from 'assets/icons/Field/foodprocessing.png';
import construction from 'assets/icons/Field/construction.png';
import mining_resources from 'assets/icons/Field/mining_resources.png';
import machine from 'assets/icons/Field/machine.png';
import ict from 'assets/icons/Field/ict.png';
import material from 'assets/icons/Field/material.png';
import chemistry from 'assets/icons/Field/chemistry.png';
import clothes from 'assets/icons/Field/clothes.png';
import electrical from 'assets/icons/Field/electrical.png';
import food from 'assets/icons/Field/food.png';
import printing from 'assets/icons/Field/printing.png';
import agriculture from 'assets/icons/Field/agriculture.png';
import safety from 'assets/icons/Field/safety.png';
import environment from 'assets/icons/Field/environment.png';
import logo from 'assets/icons/Sidebar/studybuddyLogo.png';


const CommunityField = ({ field }) => {
    const getFieldImage = () => {
        switch (field) {
            case '경영/회계/사무':
                return business;
            case '금융/보험':
                return finance;
            case '교육/자연/과학/사회과학':
                return education;
            case '법률/경찰/소방/교도/국방':
                return law;
            case '보건/의료':
                return medical;
            case '사회복지/종교':
                return religion;
            case '문화/예술/디자인/방송':
                return palette;
            case '운전/운송':
                return operation;
            case '영업/판매':
                return sales;
            case '경비/청소':
                return security;
            case '이용/숙박/여행/오락/스포츠':
                return stay;
            case '음식서비스':
                return foodprocessing;
            case '건설':
                return construction;
            case '광업자원':
                return mining_resources;
            case '기계':
                return machine;
            case '정보통신':
                return ict;
            case '재료':
                return material;
            case '화학':
                return chemistry;
            case '섬유/의복':
                return clothes;
            case '전기/전자':
                return electrical;
            case '식품/가공':
                return food;
            case '인쇄/목재/가구/공예':
                return printing;
            case '농립어업':
                return agriculture;
            case '안전관리':
                return safety;
            case '환경/에너지':
                return environment;
            default:
                return null; // 또는 기본 이미지를 반환
        }
    };

    return (
        <div>
            {getFieldImage() ? (
                <img src={getFieldImage()} alt={field} className={styles.communityPostIconPalette} />
            ) : (
                <img src={logo} alt={field} className={styles.communityPostIconPalette} />
            )}
        </div>
    );
};

export default CommunityField;