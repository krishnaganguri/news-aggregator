const express = require("express");
const axios = require("axios");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(cors());

const API_KEY = "fa983de4b8764400b33d69bddd8168e0"; 
const BASE_URL = "https://newsapi.org/v2/top-headlines?country=us";

// Cache storage
const cache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// 🔥 Rate Limiting (Max 10 requests per 5 minutes per IP)
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: { error: "Too many requests. Please wait before trying again." }
});
app.use("/news", limiter);

app.get("/news", async (req, res) => {
    try {
        const category = req.query.category || "general";
        const refresh = req.query.refresh === "true"; // Check if user requested a refresh
        const cacheKey = category;

        // Serve cached data unless refresh is requested
        if (!refresh && cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < CACHE_DURATION)) {
            console.log(`Serving cached results for category: ${category}`);
            return res.json(cache[cacheKey].data);
        }

        // Fetch fresh news if refresh is requested or cache expired
        const NEWS_URL = `${BASE_URL}&category=${category}&apiKey=${API_KEY}`;
        const response = await axios.get(NEWS_URL);

        // Store in cache
        cache[cacheKey] = {
            timestamp: Date.now(),
            data: response.data
        };

        console.log(`Fetched fresh news for category: ${category}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Error fetching news" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
