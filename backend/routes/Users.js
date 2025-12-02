import express from "express";
import { registrarUsers } from "../controllers/User.js";

const router =express.Router();
// ruta para registrar el usuario

router.post("/register",registrarUsers);
export default router;
