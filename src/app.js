import express from "express";
import cors from "cors";
import colors from "colors";
import cookieParser from "cookie-parser";
import mainRouter from "./Routes/main.route.js";
const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());

// use router main router
app.use(mainRouter);

export { app };
