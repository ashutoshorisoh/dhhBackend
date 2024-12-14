import multer from "multer";
import path from "path";

// Ensure the "temp" directory exists or change the destination to another valid folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Change "./public/temp" to a directory that exists or you want to use
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // Ensuring the file name is unique by adding a timestamp
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid overwriting
  }
});

// Create an upload middleware with your storage configuration
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Optionally, set a file size limit (10MB in this case)
  fileFilter: (req, file, cb) => {
    // You can filter the types of files allowed here (optional)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi']; // Example: only allow images
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false); // Reject file if not an image
    }
  }
});
