const axios = require("axios");

// Vercel의 서버리스 함수 형식으로 변경
module.exports = async (req, res) => {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // OPTIONS 요청 처리
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET 요청이 아닌 경우 처리
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    const api_url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(api_url, {
            headers: {
                "X-Naver-Client-Id": process.env.REACT_APP_NAVER_CLIENT_ID,
                "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_CLIENT_SECRET,
            },
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from Naver API:", error);
        return res.status(500).json({ message: "Error fetching data", error: error.message });
    }
};