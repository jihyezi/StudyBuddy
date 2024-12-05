import axios from 'axios';

export default async function handler(req, res) {
    const { query } = req.query;  // 클라이언트에서 전달된 query 파라미터

    const api_url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(api_url, {
            headers: {
                "X-Naver-Client-Id": process.env.REACT_APP_NAVER_CLIENT_ID,
                "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_CLIENT_SECRET,
            },
        });
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from Naver API:", error);
        res.status(500).json({ message: "Error fetching data", error: error.message });
    }
}