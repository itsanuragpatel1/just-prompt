import express from 'express';
import cors from 'cors'
import { userRoutes } from './routes/userRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import cookieparser from 'cookie-parser'
import { imageRoutes } from './routes/imageRoutes.js';
import { presetRoutes } from './routes/presetRoutes.js';
import { projectRouter } from './routes/projectRoutes.js';

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(cookieparser())

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/image',imageRoutes);
app.use('/api/preset',presetRoutes);
app.use('/api/project',projectRouter)

export {app};

