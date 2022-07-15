import express from "express";
// import { ObjectID } from "mongodb";
import { client } from "../index.js";
// import { auth } from "../middleware/auth.js";

const router = express.Router();

router.route("/").put(async (request, response) => {
    const setting = request.body;
    console.log(setting);
    const result = await client
        .db("expenseManager")
        .collection("settings")
        .updateOne({ email: setting.email }, { $set: setting });
    response.send({ message: "Details updated successfully !!!" });
});

router.route("/").get(async (request, response) => {
    const result = await client
        .db("expenseManager")
        .collection("settings")
        .find()
        .toArray();
    response.send(result);
});

// router.route("/:id").get(async (request, response) => {
//     const { id } = request.params;
//     const result = await client
//         .db("expenseManager")
//         .collection("settings")
//         .findOne({ _id: new ObjectID(id) });
//     response.send(result);
// });

// router.route("/:id").put(async (request, response) => {
//     const { id } = request.params;
//     const data = request.body;
//     const resul = await client
//         .db("expenseManager")
//         .collection("settings")
//         .updateOne({ _id: new ObjectID(id) }, { $set: data });
//     const result = await client
//         .db("b28wd")
//         .collection("settings")
//         .findOne({ id: id });
//     response.send(result);
// });


export const settingsRouter = router;