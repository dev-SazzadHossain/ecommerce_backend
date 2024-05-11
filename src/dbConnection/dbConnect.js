import mongoose from "mongoose";
import { dbName } from "../Constants/constants.js";

export const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${dbName}`)
    if(connectionInstance){
        console.log(`dbConnect Successfully:${connectionInstance.connection.host}`.white.bgMagenta)
    }
  } catch (error) {
    console.log(`dbConnectionFailed:${error.message}`.white.bgRed)
  }
};
