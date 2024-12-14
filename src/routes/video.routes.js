import express from "express"
import {uploadPost, getVideos, addComment, addLikes} from '../controllers/video.controller.js'
import { upload } from "../middlewares/multer.middleware.js"
import { addViews } from "../controllers/video.controller.js";

const router= express.Router();

router.post(
  "/post",  // Define the route path for registration
  upload.fields([  // Use multer middleware to handle file uploads
    {
      name: "videoFile",
      maxCount: 1
    }
  ]),
  uploadPost  
);

router.get("/videos", getVideos)
//router.post("/comments", getComments)
router.post(
  "/post/:id/comments", // Route for adding a comment to a specific video
  addComment
);

router.post(
  "/post/:id/likes", // Route for adding a comment to a specific video
  addLikes
);

router.post(
  "/post/:id/views",
  addViews
)



  export default router;