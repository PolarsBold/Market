import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const newUser = await createUser(username, password);
    const token = createToken({ id: newUser.id });
    res.status(201).send(token);
  });

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user)
      return res.status(401).json({ message: "Invalid username or password" });
    const token = createToken({ id: user.id });
    res.status(200).send(token);
  });
