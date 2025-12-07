import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    tittle: {
        type: String,
        required:true
    },
    body: {
        type:String,
        required: true
    },
    coverImageUrl: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
},
{
    timestamps: true
})

const blog = mongoose.model("blogs", blogSchema);

export default blog;