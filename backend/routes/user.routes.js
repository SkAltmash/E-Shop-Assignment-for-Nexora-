import express from "express";
import { registerUser } from "../controler/user.controler.js";
import { loginUser } from "../controler/user.controler.js";
import { logoutUser } from "../controler/user.controler.js";

const route = express.Router();
route.route("/register").post(registerUser);
route.route("/login").post(loginUser);
route.route("/logout").post(logoutUser);

export default route;
