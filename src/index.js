// index.js
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";  // Import the app from app.js

/*dotenv.config({
    path: './env' // Ensure the correct path to your .env file
});*/

dotenv.config(); 

// Connect to the database and start the server
connectDB()
.then(() => {
    const port = process.env.PORT; // Use the port from environment variable only
    app.listen(port, () => {
        console.log(`Server is running at port: ${port}`);
    });
})

    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });
