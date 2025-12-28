import { Router } from "express";
import { addPresets, getAllPresets } from "../controllers/presetController.js";


const presetRoutes=Router();

presetRoutes.get('/all',getAllPresets);
presetRoutes.post("/add",addPresets);


export {presetRoutes};