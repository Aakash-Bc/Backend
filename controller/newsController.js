import axios from "axios";

export const getNews = async (req, res) => {
    const { q = 'technology' } = req.query;
    const apiKey = "68bdb3d4642e467db3702c03e1a1a53b";
    try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${q}&pageSize=40&sortBy=publishedAt&apiKey=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error proxying news:", error.message);
        res.status(500).json({ message: "Failed to fetch news from provider" });
    }
};
