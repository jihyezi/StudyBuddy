import Comments from "../components/Comments";
import Inputfield from "../components/Inputfield";
import InputButton from "../components/InputButton";
import StudyPost from "../components/StudyPost";
import profile from '../assets/images/profile1.png'
import arrow from '../assets/icons/arrow_down.png'

const data = {
    nickname: '페이커',
    time: '40분전',
    content: '저도 스터디 참여하고 싶어요!!',
    profile: profile
}

const data2 = {
    title: '이름',
    placeholder: '커뮤니티 이름을 입력해주세요.'
}

const data3 = {
    title: '대표 이미지',
    placeholder: '커뮤니티 대표 이미지를 넣어주세요.',
    btnimg: arrow
}

const data4 = {
    state: '1',
    title: '정보보안기사 온라인 스터디',
    content: '정보처리기사 온라인 스터디 모집합니다! 디코에서 주 3회 스터디 진행할 예정입니다!!',
    tag: ["정보보안기사", "온라인 스터디", "자격증"],
    person: 4,
    type: '온라인'
}

const Test = () => {
    return (
        <div>
            <Comments nickname={data.nickname} time={data.time} content={data.content} profile={data.profile} />
            <Inputfield title={data2.title} placeholder={data2.placeholder} />
            <InputButton title={data3.title} placeholder={data3.placeholder} btnimg={data3.btnimg} />
            <StudyPost state={data4.state} title={data4.title} content={data4.content} tag={data4.tag} person={data4.person} type={data4.type} />
        </div>
    )
}

export default Test;