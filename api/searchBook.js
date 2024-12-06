const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const handler = async (req, res) => {
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

app.get('*', handler);

module.exports = app;