import { Router } from "express";
import { auth } from "../middlewares/authMiddleware.js";
import { getProject } from "../controllers/projectController.js";

const projectRouter=Router();

projectRouter.get('/:projectId',auth,getProject)

export {projectRouter}