import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { auth } from "./auth.js";
import { userRouter } from "./pages/userRouter.js";
import { settingsRouter } from "./pages/settingsRouter.js";
import { billsRouter } from "./pages/billsRouter.js";
// import dotenv from 'dotenv';

dotenv.config()
export const app = express();
// const port = 5000;
const port = process.env.PORT || 5000;
// const MONGO_URL = "mongodb://localhost";
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());
app.use(cors({
    origin: "*",
}));

app.listen(port, () => console.log(`Server is listening on Port no : ${port}`));

app.get("/", (request, response) => {
    response.send("Home Page");
})

async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Client Connected");
    return client;
}

export const client = await createConnection();

app.use("/user", userRouter);
app.use("/settings", settingsRouter);
app.use("/bills", billsRouter);
app.use("/contact", auth, (req, res) => res.send({ result: "Token Validated" }));
app.use("/", auth, (req, res) => res.send({ result: "Token Validated" }));