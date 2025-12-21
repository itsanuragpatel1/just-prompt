import { Router } from "express";
import { getAllPresets } from "../controllers/presetController.js";


const presetRoutes=Router();

presetRoutes.get('/all',getAllPresets);


export {presetRoutes};