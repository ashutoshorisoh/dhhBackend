import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Artist from "../models/artist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Controller function to add a new artist
const addArtist = asyncHandler(async (req, res) => {
    const { name, spotifyUrl } = req.body;

    // Validate required fields
    if (!name || !spotifyUrl || name.trim() === "" || spotifyUrl.trim() === "") {
        throw new ApiError(400, "Artist name and Spotify URL are required");
    }

    // Check if the artist with the same name or Spotify URL already exists
    const existedArtist = await Artist.findOne({
        $or: [{ name: name.trim() }, { spotifyUrl: spotifyUrl.trim() }],
    });

    if (existedArtist) {
        throw new ApiError(409, "Artist with the same name or Spotify URL already exists");
    }

    // Create a new artist record
    const artist = await Artist.create({
        name: name.trim(),
        spotifyUrl: spotifyUrl.trim(),
    });

    // Send success response
    return res.status(201).json(
        new ApiResponse(201, artist, "Artist added successfully")
    );
});

// Controller function to get all artists
const getArtists = asyncHandler(async (req, res) => {
    const artists = await Artist.find(); // Fetch all artists from the database

    // Send the response with the artist data
    return res.status(200).json(
        new ApiResponse(200, artists, "Artists fetched successfully")
    );
});

// Controller function to get an artist by name
const getArtistByName = asyncHandler(async (req, res) => {
    const { name } = req.params;

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Artist name is required");
    }

    const artist = await Artist.findOne({ name: name.trim() });

    if (!artist) {
        throw new ApiError(404, "Artist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, artist, "Artist details fetched successfully")
    );
});

export { addArtist, getArtists, getArtistByName };
