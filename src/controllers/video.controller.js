import { asyncHandler } from "../utils/asyncHandler.js"; // Assuming asyncHandler is in utils
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudInary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadPost = asyncHandler(async (req, res) => {
    const { title, description, username } = req.body;

    if (!title || title.trim() === "") {
        throw new ApiError(400, "title is required");
    }

    if (!username || username.trim() === "") {
        throw new ApiError(400, "username is required");
    }

    // Check if the user exists in the database
    const user = await User.findOne({ username: username.trim() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const videoFilePath = req.files?.videoFile ? req.files.videoFile[0]?.path : null;

    if (!videoFilePath) {
        throw new ApiError(400, "upload video first");
    }

    try {
        // Upload the video to Cloudinary
        const videoFileUp = await uploadOnCloudinary(videoFilePath, user.username); // Assuming you have functionality to create a folder for the user

        if (!videoFileUp) {
            throw new ApiError(400, "file upload failed");
        }

        // Create a new video entry in the database
        const newVideo = new Video({
            videoFile: videoFileUp.url, // URL from Cloudinary response
            title,
            description,
            time: videoFileUp.duration, // Adjust based on Cloudinary response
            owner: user._id // Store the owner's ID
        });

        await newVideo.save();

        // Log the file URL and owner's name to the console
        console.log(`Video uploaded: ${videoFileUp.url}`);
        console.log(`Uploaded by: ${user.fullname}`);

        res.status(201).json(new ApiResponse(201, "Video uploaded successfully", newVideo));
    } catch (error) {
        console.error("Detailed error:", error);
        throw new ApiError(500, "An error occurred while uploading the video");
    }
});

const getVideos = asyncHandler(async (req, res) => {
    try {
      const videos = await Video.find().populate('owner'); // Adjust fields as needed
      res.status(200).json(new ApiResponse(200, "Videos fetched successfully", { data: videos }));
    } catch (error) {
      console.error("Detailed error:", error);
      res.status(500).json({ message: 'Error retrieving videos' });
    }
  });


const addComment = asyncHandler(async (req, res) => {
    const videoId = req.params.id; // Video ID passed as a route parameter
    const { username, comment } = req.body; // New comment details

    if (!username || !comment) {
        throw new ApiError(400, "Username and comment are required");
    }

    // Find the video by ID
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Push the new comment into the comments array
    video.comments.push({ username, comment });
    console.log(`new comment on ${video._id} by ${username}`);
    

    // Save the updated video document
    await video.save();

    res.status(200).json(new ApiResponse(200, "Comment added successfully", video));
});

const addLikes = asyncHandler(async (req, res) => {
    const videoId = req.params.id;
    const { username } = req.body;

    if (!username) {
        throw new ApiError(400, "Username is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check if the user has already liked the video
    const likeIndex = video.likes.findIndex(like => like.username === username);

    if (likeIndex > -1) {
        // User has already liked, remove the like
        video.likes.splice(likeIndex, 1);
        console.log("unliked");
    } else {
        // User has not liked yet, add the like
        video.likes.push({ username });
        console.log("liked");
    }

    // Save the updated video document
    await video.save();

    res.status(200).json(new ApiResponse(200, "Like updated successfully", video));
});

const addViews = asyncHandler(async (req, res) => {
    const videoId = req.params.id; // Video ID passed as a route parameter

    // Find the video by ID
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Increment the views count
    video.views += 1;

    // Save the updated video document
    await video.save();

    console.log(`Views incremented for video: ${video._id}`);

    res.status(200).json(new ApiResponse(200, "View count incremented", video));
});



  

export {uploadPost, getVideos, addComment, addLikes, addViews} 