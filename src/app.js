import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";

// Import artist routes
import artistDetailRoutes from './routes/artistDetail.routes.js'

const app = express();

let accessToken = null;
let tokenExpiryTime = null;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" })); // Parse JSON payloads up to 16kb in size
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static("public")); // Serve static files from the "public" folder
app.use(cookieParser()); // Use cookie-parser for handling cookies

// Function to fetch Spotify access token
async function fetchSpotifyToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

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

// Endpoint to get Spotify token
app.get("/spotify-token", async (req, res) => {
    if (!accessToken || Date.now() >= tokenExpiryTime) {
        await fetchSpotifyToken();
    }
    res.json({ accessToken });
});

// Import other routes (e.g., user, video)
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';

// Mount routes
app.use("/api/v1/users", userRouter); // Mount user routes at /api/v1/users
app.use("/api/v1", videoRouter);      // Mount video routes at /api/v1

// Mount artist routes at /api/v1/artists
app.use("/api/v1/artists", artistDetailRoutes); // Adding artist routes here

export { app };
