import { asyncHandler } from "../utils/asyncHandler.js"; // Assuming asyncHandler is in utils
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudInary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Controller function to register a user
const registerUser = asyncHandler(async (req, res) => {
    // Extract user details from the request body
    const { username, email, fullname, password } = req.body;

    // Validate required fields
    if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Full name, username, email, and password are required");
    }

    // Normalize username and email
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    // Check if the user already exists
    const existedUser = await User.findOne({
        $or: [{ username: normalizedUsername }, { email: normalizedEmail }]
    });

    console.log("Checking for existing user:", normalizedUsername, normalizedEmail); // Debugging

    if (existedUser) {
        console.log("Found existing user:", existedUser); // Debugging
        throw new ApiError(409, "Username or email already exists");
    }

    // Handle file uploads: avatar and cover image
    const avatarLocalPath = req.files?.avatar ? req.files.avatar[0]?.path : null;
    const coverimageLocalPath = req.files?.coverimage ? req.files.coverimage[0]?.path : null;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    try {
        // Upload files to Cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverimage = coverimageLocalPath ? await uploadOnCloudinary(coverimageLocalPath) : null;

        if (!avatar) {
            throw new ApiError(400, "Avatar upload failed");
        }

        // Create a new user record
        const user = await User.create({
            fullname,
            avatar: avatar.url,
            username: normalizedUsername,
            email: normalizedEmail,
            coverimage: coverimage?.url || "",  // Cover image is optional
            password,
        });

        // Find the created user and exclude sensitive data (password, refresh token)
        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        // Send the success response
        return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
        console.log(user)

    } catch (error) {
        console.error('Error during registration:', error);
        throw new ApiError(500, "Something went wrong during user registration");
    }
});


// Controller function to login a user
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body; // No need for await here

    // Validate the non-empty fields
    if (!username || !password || username.trim() === "" || password.trim() === "") {
        throw new ApiError(400, "Username and password are required");
    }

    // Normalize the username to lowercase
    const normalizedUsername = username.trim().toLowerCase();

    // Find user in DB
    const findUser = await User.findOne({ username: normalizedUsername });
    if (!findUser) {
        throw new ApiError(400, "User doesn't exist");
    }

    // Check if password is correct (assuming you have a method like bcrypt.compare())
    const isPasswordCorrect = await findUser.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password");
    }

    // Exclude sensitive fields (password, refreshToken) from the response
    const responseUser = await User.findById(findUser._id).select("-password -refreshToken");

    // Send success response
    res.status(200).json(new ApiResponse(200, responseUser, "Login successful"));
    console.log(responseUser)
});

//fetchingUser for post

const getUsers = asyncHandler(async (req, res) => {
    try {
      const users = await User.find(); // Fetch users from the database
  
      // Ensure you send the correct response with the data
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: 'Users fetched successfully', // Message you can adjust
        data: users // The actual user data
      });
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ message: 'Error retrieving users' });
    }
  });
  


export { registerUser, loginUser, getUsers };
