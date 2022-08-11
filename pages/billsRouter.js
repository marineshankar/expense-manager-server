import { client } from "../index.js";
import express from "express";
import { ObjectID } from "mongodb";

const router = express.Router();


router.route("/").get(async (request, response) => {
    const data = await client
        .db("expenseManager")
        .collection("bills")
        .find({})
        .toArray();
    response.send(data);
});

router.route("/:id").get(async (request, response) => {
    const { id } = request.params;
    const bill = await client
        .db("expenseManager")
        .collection("bills")
        .findOne({ _id: new ObjectID(id) });
    bill ? response.send(bill) : response.send("No bills found!!!");
});

router.route("/").post(async (request, response) => {
    const bill = request.body;
    const result = await client
        .db("expenseManager")
        .collection("bills")
        .insertOne(bill);
    response.send(result);
});

router.route("/:id").delete(async (request, response) => {
    const { id } = request.params;
    const deleteBill = await client
        .db("expenseManager")
        .collection("bills")
        .deleteOne({ _id: new ObjectID(id) });
    response.send(deleteBill);
});

router.route("/:id").put(async (request, response) => {
    const { id } = request.params;
    const data = request.body;
    const updateBill = await client
        .db("expenseManager")
        .collection("bills")
        .updateOne({ _id: new ObjectID(id) }, { $set: data });
    const result = await client
        .db("expenseManager")
        .collection("bills")
        .findOne({ _id: new ObjectID(id) });
    response.send(result);
})

export const billsRouter = router; 
