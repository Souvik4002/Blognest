import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
import userRouter from "./routes/user.js";
import blogRouter from "./routes/blog.js"
import { restrictToLoggedInUserOnly } from "./middlewares/authentication.js";
import cookieParser from 'cookie-parser';
import { error } from "console";
import blog from "./db/user.blog.js";
import users from "./db/user.model.js";
import comment from "./db/user.comments.js";


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
// making the static files acceseable



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__filename);
console.log(__dirname);
console.log(path.resolve())



// MongoDB connection
const mongoURI = 'mongodb+srv://password:password%40123@backenddb.dltf4ge.mongodb.net/backend_project?retryWrites=true&w=majority&appName=backenddb'; // Update with your connection string if using Atlas

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));



app.set("view engine", "ejs");
app.set("views", path.resolve("views"))

app.get("/", restrictToLoggedInUserOnly, async (req, res) => {
    try {
        const blogs = await blog.find();
        if (!req.user) req.user = null;
        res.render('home', {
            blogs: blogs,
            user: req.user,
            error: null
        })
    } catch (error) {
        console.log(error);
    }
});
app.get('/get', async (req,res) => {
    try {
        const item = await blog.find().populate('author');
      res.send(item)
    } catch (error) {
        console.log(error);
    }
})
app.delete('/delete/:id', async(req,res)=>{
    try {
        const id = req.params.id;
       const item =  await blog.findByIdAndDelete(id);
       res.send(item)
    } catch (error) {
       console.log(error); 
    } 
})

app.get('/comments', async (req,res) => {
    try {
      const item = await comment.find();
      res.send(item);
    } catch (error) {
       console.log(error) 
    }
})
app.delete('/comments/:id', async(req,res)=>{
    try {
        const id = req.params.id;
       const item =  await comment.findByIdAndDelete(id);
       res.send(item)
    } catch (error) {
       console.log(error); 
    } 
})

app.use("/users", userRouter);
app.use("/blogs", blogRouter)


app.listen(3000, () => console.log("Server started on port 3000"));

