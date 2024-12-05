const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.header('Origin')); // 클라이언트 요청의 Origin을 허용
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 허용할 헤더 추가
    next();
});

// 책 검색 API
app.get("/api/searchBook", async (req, res) => {
    const query = req.query.query;
    const api_url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}`;

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
});

// 장소 검색 API
app.get("/api/searchPlace", async (req, res) => {
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
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});