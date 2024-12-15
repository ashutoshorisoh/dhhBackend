//artistDetail.routes.js
import express from "express";
import { addArtist, getArtists, getArtistByName } from "../controllers/artistEntry.controller.js";

const router = express.Router();

// Route to add a new artist
router.post("/add", addArtist);

// Route to get all artists
router.get("/", getArtists);

// Route to get a specific artist by their name
router.get("/:name", getArtistByName);

export default router;
