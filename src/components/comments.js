import profile from '../assets/images/profile1.png'

const data = {
    data1: {
        nickname: '페이커',
        time: '40분전',
        content: '저도 스터디 참여하고 싶어요!!!',
    }
}

const Comments = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', padding: 4 }}>
            <div>
                <img src={profile} style={{ width: 50, height: 50, borderRadius: 25 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 16, marginTop: 4 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#2D2D2D', fontSize: 16, fontWeight: 800 }}>{data.data1.nickname}</span>
                    <span style={{ color: '#9E9E9E', fontSize: 12, fontWeight: 500 }}>{data.data1.time}</span>
                </div>
                <span style={{ color: '#2D2D2D', fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{data.data1.content}</span>
                <button style={{ background: 'white', border: 'none', color: '#9E9E9E', fontSize: 12, textAlign: 'left' }}>답글 달기</button>
            </div>

        </div>
    )
}

export default Comments;
