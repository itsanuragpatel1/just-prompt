import {Router} from 'express'
import { fixFace, genImage, reRun, upscale } from '../controllers/imageController.js';
import { upload } from '../middlewares/multerMiddleware.js';
import { auth } from '../middlewares/authMiddleware.js';

const imageRoutes=Router();

// imageRoutes.post('/edit',auth,upload.single('image'),editImage);
imageRoutes.post('/generate' ,auth,upload.single('image'), genImage);
imageRoutes.post('/re-run',auth,reRun)
imageRoutes.post('/fix-face',auth,fixFace)
imageRoutes.post('/upscale',auth,upscale)

export {imageRoutes}