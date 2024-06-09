const data = {
    data1: {
        title: '이름',
        placeholder: '커뮤니티 이름을 입력해주세요'
    }
}

const inputfield = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center' }}>
            <div style={{ color: '#808080', fontSize: 20, fontWeight: 600 }}>{data.data1.title}</div>
            <div>
                <input type="text" placeholder={data.data1.placeholder} style={{ width: 900, height: 40, paddingLeft: 16, borderRadius: 8, borderWidth: 1.5, borderStyle: 'solid', borderColor: '#B6B6B6', outlineColor: '#FF7474' }} />
            </div>
        </div>
    )
}

export default inputfield;