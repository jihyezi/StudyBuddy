import Comments from "../components/Comments";
import Inputfield from "../components/Inputfield";
import InputButton from "../components/InputButton";
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

const Test = () => {
    return (
        <div>
            <Comments nickname={data.nickname} time={data.time} content={data.content} profile={data.profile} />
            <Inputfield title={data2.title} placeholder={data2.placeholder} />
            <InputButton title={data3.title} placeholder={data3.placeholder} btnimg={data3.btnimg} />
        </div>
    )
}

export default Test;