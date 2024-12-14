import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const LikeSchema = new mongoose.Schema({
    username: {type: String, required: true},
})


const videoSchema = new Schema(
    {
        videoFile:{
            type: String, //cloudnary url
            required: true
        },
        thumbnail:{
            type: String, //cloudnary url
            //required: true
        },
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            //required: true
        },
        time:{
            type: Number, //from cloudnary url
            required: true
        },
        views:{
            type:Number,
            default: 0
        },
        isPublished:{
            type: Boolean,
            default: true
        },
        owner:[
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        comments: [commentSchema],
        likes: [LikeSchema]
        

    },
    {
      timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)