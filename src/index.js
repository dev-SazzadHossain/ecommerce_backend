import { app } from "./app.js";
import { dbConnect } from "./dbConnection/dbConnect.js";

dbConnect()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is Running PORT:${process.env.PORT}`.bgBlack.white);
    });
  })
  .catch((err) => console.log(`dbConnect issue:${err.message}`.white.bgRed));
