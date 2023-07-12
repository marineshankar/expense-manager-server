import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { auth } from "./auth.js";
import { userRouter } from "./pages/userRouter.js";
import { settingsRouter } from "./pages/settingsRouter.js";
import { billsRouter } from "./pages/billsRouter.js";
import dotenv from 'dotenv';
import axios from 'axios';

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

app.post("/sms", async (request, response) => {
    console.log('smsOut called');
    const value = request.body;
    try {
        const result = await new Promise(async (resolve, reject) => {
            const data = JSON.stringify({
                data: {
                    type: 'outbound_messages',
                    attributes: {
                        destination: value.destination,
                        source: value.source,
                        content: value.content
                    }
                }
            });

            const config = {
                data,
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://sms-out.didww.com/outbound_messages',
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Basic ${process.env.SMS_OUT_CREDENTIALS}`
                }
            };

            axios.request(config)
                .then((response) => {
                    console.log('response.data', response.data);
                    resolve(response.data);
                })
                .catch((error) => {
                    console.log('error', error);
                    resolve(error.response.data);
                });
        });
        console.log('result', result);
        response.send(result);
    } catch (err) {
        console.log(err);
        return res;
    }
})

app.post("/smsOutResponse", (request, response) => {
    console.log('smsOutResponse', request.body);
    response.send(request.body);
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
// app.use("/", auth, (req, res) => res.send({ result: "Token Validated" }));