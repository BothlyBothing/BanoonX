import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // VK API Proxy/Service
  app.get("/api/vk/profile", async (req, res) => {
    const { userId, accessToken } = req.query;

    if (!accessToken) {
      return res.status(400).json({ error: "VK Access Token is required" });
    }

    try {
      // Get user info
      const userResponse = await axios.get("https://api.vk.com/method/users.get", {
        params: {
          user_ids: userId,
          fields: "about,activities,bdate,books,career,city,connections,contacts,counters,country,domain,education,exports,followers_count,games,home_town,interests,last_seen,lists,military,movies,music,nickname,occupation,personal,quotes,relatives,relation,schools,sex,site,status,timezone,tv,universities,verified,wall_comments",
          access_token: accessToken,
          v: "5.131",
        },
      });

      if (userResponse.data.error) {
        return res.status(400).json({ error: userResponse.data.error.error_msg });
      }

      const userData = userResponse.data.response[0];

      // Get some wall posts for "analysis"
      const wallResponse = await axios.get("https://api.vk.com/method/wall.get", {
        params: {
          owner_id: userData.id,
          count: 10,
          access_token: accessToken,
          v: "5.131",
        },
      });

      res.json({
        profile: userData,
        wall: wallResponse.data.response?.items || [],
      });
    } catch (error: any) {
      console.error("VK API Error:", error.message);
      res.status(500).json({ error: "Failed to fetch VK data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
