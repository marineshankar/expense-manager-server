import express from "express";
import { client } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const genPassword = async (password) => {
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

router.route("/signup").post(async (req, res) => {
    const { name, email, password } = req.body;
    const userFromDb = await client.db("expenseManager").collection("users").findOne({ email: email });
    if (userFromDb) {
        res.send({ message: "Email ID already exists.", result: false });
    }
    else {
        const hashedPassword = await genPassword(password);
        const userProfile = await client.db("expenseManager").collection("users").insertOne({ name: name, email: email, password: hashedPassword });
        const userSettings = await client.db("expenseManager").collection("settings").insertOne({ email: email });
        res.send({ message: "Account created successfully !!! Click login to continue... ", result: true });
    }
})

router.route("/login").post(async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    const userFromDb = await client.db("expenseManager").collection("users").findOne({ email: email });
    if (userFromDb) {
        const storedPassword = userFromDb.password;
        const isPasswordMatch = await bcrypt.compare(password, storedPassword);
        if (isPasswordMatch === true) {
            const token = jwt.sign({ id: userFromDb._id }, "MY_SECRET_KEY");
            res.send({ message: "Login Successful", token: token });
        }
        else {
            res.send({ password: "The password that you've entered is incorrect." });
        }
    }
    else {
        res.send({ username: "The email address you entered doesn't exist." });
    }
})

export const userRouter = router;