import express from "express";
import { httpGetDatosPersonaje } from "./regciv.controller.js";
export const regcivRouter = express.Router();
regcivRouter.post("/", httpGetDatosPersonaje);
