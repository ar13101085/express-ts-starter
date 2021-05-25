require('source-map-support').install()
require('dotenv').config();
import { ConnectionOptions, connect } from "mongoose";
import { app } from "./app";
const start = async () => {
    if (!process.env.PORT) {
        throw new Error('PORT is not defined.');
    }
    if (!process.env.DB_URL) {
        throw new Error('DB_URL is not defined.');
    }
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error('JWT_SECRET_KEY is not defined.');
    }
    try {
        const options: ConnectionOptions = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        };
        await connect(process.env.DB_URL, options);
        console.log("successfully connected with mongodb")
    } catch (error) {

    }
    let port = process.env.PORT || 3000;
    
    app.listen(port, () => {
        console.log(`Listening on port ${port}!`);
    });

}
start();