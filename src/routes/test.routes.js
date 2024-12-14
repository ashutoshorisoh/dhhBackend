import { Router } from "express";
import { testUser } from "../controller/test.controller.js";

const testrouter = Router();

testrouter.get("/", (req, res) => {
    res.send("Users endpoint");
});

testrouter.post("/testuser", testUser);

export default testrouter;
