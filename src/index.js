import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
import userRouter from "./routes/user.js";
import blogRouter from "./routes/blog.js"
import { restrictToLoggedInUserOnly } from "./middlewares/authentication.js";
import cookieParser from 'cookie-parser';
import blog from "./db/user.blog.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
// making the static files acceseable



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//console.log(__filename);
//console.log(__dirname);
//console.log(path.resolve())



// MongoDB connection
const mongoURI = process.env.MONGODB_URL; 
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


app.use("/users", userRouter);
app.use("/blogs", blogRouter)


app.listen(3000, () => console.log("Server started on port 3000"));

