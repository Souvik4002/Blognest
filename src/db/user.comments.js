import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    body: {
        type:String,
        required: true
    },
   blogid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blogs',
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
},
{
    timestamps: true
})

const comments = mongoose.model("comment", commentSchema);

export default comments;