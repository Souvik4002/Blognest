import express from 'express';
import { restrictToLoggedInUserOnly } from '../middlewares/authentication.js';
import multer from 'multer';
import path from "path";
import blog from '../db/user.blog.js';
import users from '../db/user.model.js';
import comment from '../db/user.comments.js';


const __dirname = path.resolve()

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "public", "uploads"))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });

router.get('/createblog', (req, res) => {
    res.render("addBlog",
        {
            error: null,
            user: req.user
        }
    );
})



router.post('/', upload.single('coverImage'),restrictToLoggedInUserOnly, async (req, res) => {
    const { tittle, body } = req.body;
    await blog.create({
        tittle: tittle,
        body: body,
        coverImageUrl: `/uploads/${req.file.originalname}`,
        author: req.user.id
    })
    res.redirect('/');
});

router.get("/:id", restrictToLoggedInUserOnly, async (req, res) => {
    try {
        if (req.authError) {  //if there is a login error we will just show it
            return res.render('blogpage', {
                blogDetails:null,
                error: req.authError
            })
        }
        const { id } = req.params;
        const blogData = await blog.findById(id).populate('author')
        const comments = await comment.find({blogid: id}).populate('author')
        console.log(comments)
        return res.render('blogpage', {
            user: req.user,
            blogData,
            error: null,
            comments
        })
    } catch (error) {
        console.log(error);
    }
})

router.post('/comments/:id', restrictToLoggedInUserOnly, async (req,res) => {
    try {
       const {commentBody} = req.body;
       const { id } = req.params;
       const commentitem =  await comment.create({
          body: commentBody,
          blogid: id,
          author: req.user.id
       })
      res.redirect(`/blogs/${id}`)
    } catch (error) {
       console.log(error) 
    }
})

export default router;