import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import artistDetailRoutes from './routes/artistDetail.routes.js';
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';

dotenv.config();

const app = express();

let accessToken = null;
let tokenExpiryTime = null;

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*', // Replace '*' with your frontend's domain in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials like cookies
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Function to fetch Spotify access token
async function fetchSpotifyToken() {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error('Spotify client credentials are missing');
        }

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(clientId + ":" + clientSecret).toString("base64")}`,
            },
            body: "grant_type=client_credentials",
        });

        const data = await response.json();

        if (response.ok) {
            accessToken = data.access_token;
            tokenExpiryTime = Date.now() + data.expires_in * 1000; // Save expiration time
        } else {
            throw new Error(data.error_description || 'Failed to fetch access token');
        }
    } catch (error) {
        console.error('Error fetching Spotify token:', error);
    }
}

// Endpoint to get Spotify token
app.get("/spotify-token", async (req, res) => {
    if (!accessToken || Date.now() >= tokenExpiryTime) {
        await fetchSpotifyToken();
    }
    res.json({ accessToken });
});

// Mount routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1", videoRouter);
app.use("/api/v1/artists", artistDetailRoutes);

export { app };
