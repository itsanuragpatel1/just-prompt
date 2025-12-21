import {Router} from 'express'
import { editImage, generateImage, genImage } from '../controllers/imageController.js';
import { upload } from '../middlewares/multerMiddleware.js';
import { auth } from '../middlewares/authMiddleware.js';

const imageRoutes=Router();

// imageRoutes.post('/edit',auth,upload.single('image'),editImage);
imageRoutes.post('/generate' ,auth,upload.single('image'), genImage);

export {imageRoutes}