import express from "express";
import fileUploader from "../Middleware/multer.middleware.js";
import {
  userEmailVerify,
  userLogOut,
  userLoginController,
  userPasswordChange,
  userProfileUpdate,
  userRegisterController,
  userUpdateProfileInfo,
} from "../Controllers/user.controller.js";
import { verifyLoggedUser } from "../Middleware/auth.middleware.js";
import {
  categoryController,
  subCategoryController,
} from "../Controllers/category.controller.js";
import { checkAdmin } from "../Middleware/checkAdmin.middleware.js";
import { productController } from "../Controllers/product.controller.js";
import { inventoryController } from "../Controllers/inventory.controller.js";
const allRouters = express.Router();

// user routes
allRouters.route("/register").post(userRegisterController);
allRouters.route("/login").post(userLoginController);
allRouters.route("/logout").post(verifyLoggedUser, userLogOut);
allRouters
  .route("/profileChange")
  .post(verifyLoggedUser, fileUploader.single("image"), userProfileUpdate);
allRouters.route("/passwordChange").patch(verifyLoggedUser, userPasswordChange);
allRouters.route("/userEdit").patch(verifyLoggedUser, userUpdateProfileInfo);
allRouters.route("/emailVerify").post(verifyLoggedUser, userEmailVerify);

// category routes
allRouters
  .route("/category")
  .post(checkAdmin, fileUploader.single("categoryImage"), categoryController);
allRouters
  .route("/category")
  .post(checkAdmin, fileUploader.single("image"), subCategoryController);

// products routes

allRouters.route("/product").post(
  checkAdmin,
  fileUploader.fields([
    { name: "productFeaturedImage", maxCount: 1 },
    { name: "thumbnail", maxCount: 3 },
  ]),
  productController
);
allRouters.route("/inventory").post(checkAdmin, inventoryController);

export default allRouters;
