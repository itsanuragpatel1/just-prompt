import './config/laodEnv.js'
import { connectDB } from "./config/db.js";
import { app } from "./app.js";

const port=process.env.PORT||3000;

const startServer=async()=>{
    try {
        await connectDB();
        app.listen(port,()=>{console.log(`Server Start Listening at port ${port}`)})
    } catch (error) {
        console.log("error in starting server",error);
        process.exit(1);
    }
}

startServer();

