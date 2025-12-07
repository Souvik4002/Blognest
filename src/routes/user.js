import express from 'express';
import mongoose from 'mongoose';
import userModel from "../db/user.model.js";
import { setToken, verifyUser } from "../utils/auth.js"
import bcrypt from "bcrypt";
import { restrictToLoggedInUserOnly } from '../middlewares/authentication.js';

const router = express.Router();

router.get('/signin', restrictToLoggedInUserOnly, async (req, res) => {
    res.render("signin",
        {error: null,
        user: req.user
        });
})
router.get('/signup', async (req, res) => {
    res.render("signup");
})
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.create({
            name,
            email,
            password,
            role
        })
        res.redirect("/");
        console.log(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }

})

router.get('/getalluser', async (req, res) => {
    try {
        const users = await userModel.find();
        res.send(users)
    } catch (error) {
        console.log(error)
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            console.log("user not found register yourself")
            return res.redirect('/users/signup');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Incorrect password or email");
        }
        const token = setToken(user);
        res.cookie("uid", token);
        return res.redirect('/');
    } catch (error) {
        res.render('signin',{
            error: "incorrect password or email"
        })
    }
})


router.get("/logout", (req,res)=>{
   res.clearCookie("uid").redirect("/");
})
export default router;