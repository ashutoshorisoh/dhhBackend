import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";

const app = express();

let accessToken = process.env.SPOTIFY_CLIENT_ID;
let tokenExpiryTime = process.env.SPOTIFY_CLIENT_SECRET;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}));

app.use(express.json({ limit: "16kb" })); // Parse JSON payloads up to 16kb in size
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static("public")); // Serve static files from the "public" folder
app.use(cookieParser()); // Use cookie-parser for handling cookies

async function fetchSpotifyToken() {
    const clientId = "your_client_id";
    const clientSecret = "your_client_secret";

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(clientId + ":" + clientSecret).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
    });

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiryTime = Date.now() + data.expires_in * 1000; // Save expiration time
}

app.get("/spotify-token", async (req, res) => {
    if (!accessToken || Date.now() >= tokenExpiryTime) {
        await fetchSpotifyToken();
    }
    res.json({ accessToken });
});

// Import routes
import userRouter from './routes/user.routes.js';

// Route declarations
app.use("/api/v1/users", userRouter); // Mount user routes at /api/v1/users

import videoRouter from './routes/video.routes.js'
app.use("/api/v1/", videoRouter); 

export { app };
