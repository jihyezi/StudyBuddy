const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

// 책 검색 API 
const searchBookHandler = async (req, res) => {
    const query = req.query.query;
    const api_url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}`;

    // 환경변수 확인
    if (!process.env.REACT_APP_NAVER_CLIENT_ID || !process.env.REACT_APP_NAVER_CLIENT_SECRET) {
        console.error('Missing Naver API credentials');
        return res.status(500).json({ message: "Server configuration error" });
    }

    console.log(api_url);

    try {
        const response = await axios.get(api_url, {
            headers: {
                "X-Naver-Client-Id": process.env.REACT_APP_NAVER_CLIENT_ID,
                "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_CLIENT_SECRET,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from Naver API:", error);
        res.status(500).json({ message: "Error fetching data", error: error.message });
    }
};

// 장소 검색 API
const searchPlaceHandler = async (req, res) => {
    const query = req.query.query;
    const api_url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=10`;

    try {
        const response = await axios.get(api_url, {
            headers: {
                "X-Naver-Client-Id": process.env.REACT_APP_NAVER_CLIENT_ID,
                "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_CLIENT_SECRET,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from Naver API:", error);
        res.status(500).json({ message: "Error fetching data", error: error.message });
    }
};

app.get("/api/searchBook", searchBookHandler);
app.get("/api/searchPlace", searchPlaceHandler);

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

// Vercel serverless function handler
module.exports = async (req, res) => {
    // 요청 경로 확인
    console.log('Request path:', req.url);

    // Express 앱으로 요청 처리
    return app(req, res);
};