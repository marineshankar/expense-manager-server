import { client } from "../index.js";
import express from "express";

const router = express.Router();

router.route("/out").post(async (req, res) => {
    console.log('smsOut called');
    const value = req.body;
    try {
        return new Promise((resolve, reject) => {
            try {
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
                        resolve(response.data);
                    })
                    .catch((error) => {
                        console.log('error', error);
                        resolve(error.response.data);
                    });
            } catch (err) {
                reject(err);
            }
        });
    } catch (err) {
        console.log(err);
        return res;
    }
})

router.route("/").get(async (request, response) => {
    response.send('SMS Route Reached');
});

export const smsRouter = router; 
