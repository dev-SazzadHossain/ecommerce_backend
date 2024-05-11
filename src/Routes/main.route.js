import express from "express";
import allRouters from "./all.route.js";
const mainRouter = express.Router();

mainRouter.use(process.env.API, allRouters);

export default mainRouter;
