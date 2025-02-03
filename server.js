const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = "fa983de4b8764400b33d69bddd8168e0";
const BASE_URL = `https://newsapi.org/v2/top-headlines?country=us`;

app.get("/news", async (req, res) => {
    try {
        const category = req.query.category || "general"; // Default to 'general'
        const NEWS_URL = `${BASE_URL}&category=${category}&apiKey=${API_KEY}`;
        
        const response = await axios.get(NEWS_URL);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Error fetching news" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
