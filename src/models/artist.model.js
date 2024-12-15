import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the artist schema
const artistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,  // Ensure the artist name is unique
      trim: true,    // Remove leading/trailing spaces
    },
    spotifyUrl: {
      type: String,
      required: true,
      match: [
        /^https:\/\/open\.spotify\.com\/artist\/[a-zA-Z0-9]+$/,
        'Please enter a valid Spotify artist URL'
      ], // Basic validation for Spotify URL
    }
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Adding pagination functionality
artistSchema.plugin(mongooseAggregatePaginate);

// Create the model
const Artist = mongoose.model("Artist", artistSchema);

export default Artist;
