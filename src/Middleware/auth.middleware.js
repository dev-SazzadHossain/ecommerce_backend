import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";
const verifyLoggedUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace(" Bearer", "");
    // * req.headers.authorization.split(" ")[1] get token another use it
    if (!token) {
      return res.status(406).send({ error: `unauthorized request` });
    }
    const decodedToken = await jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decodedToken) {
      return res.status(406).send({ error: `unauthorized request decoded` });
    }
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(406).send({ error: `unauthorized user` });
    }
    // *set user info req inside
    req.user = user;
    next();

    //* verifySuccessfully
  } catch (error) {
    return res
      .status(404)
      .send({ error: `verifyLoggedUser Error:${error.message}`.bgWhite.red });
  }
};

export { verifyLoggedUser };
