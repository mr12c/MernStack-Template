import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();


app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
    allowedHeaders: ['Content-Type', 'Authorization', 'AuthorizationRef']  
}));

 
app.use(cookieParser());
app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" }));   

import userRouter from './routes/user.routes.js';


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});
app.use('/api/v1/users', userRouter);
 
app.use(errorHandler);

export { app };
