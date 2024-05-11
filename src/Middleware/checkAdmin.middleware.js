import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";
export const checkAdmin = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.refreshToken ||
      req.header("Authorization")?.replace(" Bearer", "");
    if (!token) {
      return res.status(406).send({ error: "invalid user credentials" });
    }
    const decodedToken = await jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decodedToken) {
      return res.status(406).send({ error: "invalid user access" });
    }
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(406).send({ error: "user dose not exist" });
    }
    if (user?.role === "admin" || user?.role === "editor") {
      req.user = user;
      next();
    } else {
      return res
        .status(406)
        .send({ error: "user not accepted only acceptable admin or editor" });
    }
  } catch (error) {
    return res
      .status(404)
      .send({ error: `admin checking error:${error.message}` });
  }
};
