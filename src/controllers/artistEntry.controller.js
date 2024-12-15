import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Artist from "../models/artist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Controller function to add a new artist
const addArtist = asyncHandler(async (req, res) => {
    // Extract artist details from the request body
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

    try {
        // Create a new artist record
        const artist = await Artist.create({
            name: name.trim(),
            spotifyUrl: spotifyUrl.trim(),
        });

        // Send success response
        return res.status(201).json(new ApiResponse(200, artist, "Artist added successfully"));
    } catch (error) {
        console.error('Error adding artist:', error);
        throw new ApiError(500, "Something went wrong during artist addition");
    }
});

// Controller function to get all artists
const getArtists = asyncHandler(async (req, res) => {
    try {
        const artists = await Artist.find(); // Fetch all artists from the database

        // Send the response with the artist data
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Artists fetched successfully',
            data: artists, // The list of artists
        });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ message: 'Error retrieving artists' });
    }
});

// Controller function to get an artist by name
const getArtistByName = asyncHandler(async (req, res) => {
    const { name } = req.params;

    try {
        const artist = await Artist.findOne({ name: name.trim() });
        if (!artist) {
            throw new ApiError(404, "Artist not found");
        }

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Artist details fetched successfully',
            data: artist,
        });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ message: 'Error retrieving artist' });
    }
});

export { addArtist, getArtists, getArtistByName };
