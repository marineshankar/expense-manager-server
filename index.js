import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { auth } from "./auth.js";
import { userRouter } from "./pages/userRouter.js";
import { settingsRouter } from "./pages/settingsRouter.js";
import { billsRouter } from "./pages/billsRouter.js";

export const app = express();
const port = 5000;
// const MONGO_URL = "mongodb://localhost";
const MONGO_URL = "mongodb+srv://Shankar:Sowmiya3191@cluster0.juv47.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

app.use(express.json());
app.use(cors({
    origin: "*",
}));

app.listen(port, () => console.log(`Server is listening on Port no : ${port}`));

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