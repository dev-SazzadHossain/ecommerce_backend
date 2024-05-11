import { Category } from "../Models/category.model.js";
import { SubCategory } from "../Models/subCategory.mode.js";
import cloudinaryService from "../Utils/cloudinary.service.js";

const categoryController = async (req, res) => {
  try {
    const { name, details } = req.body;

    if ([name, details].some((field) => field.trim() === "")) {
      return res
        .status(406)
        .send({ error: "name and details field are required" });
    }
    const existCategory = await Category.findOne({ name });
    if (existCategory) {
      return res.status(400).send({ error: "category name must be unique" });
    }
    if (!req.file) {
      return res
        .status(406)
        .send({ error: "category image field is required missing file" });
    }
    const uploadCategoryImage = await cloudinaryService(req?.file?.path);
    if (!uploadCategoryImage) {
      return res.status(404).send({ error: "file upload failed" });
    }

    const category = new Category({
      name,
      details,
      slug: name,
      categoryImage: uploadCategoryImage?.url,
      whoCreated: req?.user?._id,
    });
    const response = await category.save({ validateBeforeSave: false });
    const userResponse = await Category.findById(response?._id);
    if (!userResponse) {
      return res.status(404).send({ error: "category dose not exist" });
    }
    return res.status(200).send({
      success: true,
      message: "Category Created Successfully",
      data: userResponse,
    });
  } catch (error) {
    return res.status(404).send({ error: `category error:${error.message}` });
  }
};

// * sub category controller
const subCategoryController = async (req, res) => {
  try {
    const { name, details, categoryName } = req.body;
    if ([name, details].some((field) => field.trim() === "")) {
      return res.status(406).send({ error: "all fields are required" });
    }
    const exists = await SubCategory.findOne({ name });
    if (exists) {
      return res.send({ error: "sub category name must be unique" });
    }
    if (!req.file) {
      return res.send({ error: "must be provided sub category image" });
    }
    const uploadImage = await cloudinaryService(req?.file?.path);
    if (!uploadImage) {
      return res.send({ error: "file upload failed" });
    }
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.send({ error: "invalid category name" });
    }
    const subCategory = new SubCategory({
      name,
      details,
      slug: name,
      categoryId: category?._id,
      whoCreate: req?.user?._id,
    });

    const response = await subCategory.save({ validateBeforeSave: false });
    if (!response) {
      return res.send({ error: "subcategory save error" });
    }
    return res
      .status(200)
      .send({ success: true, message: "SubCategory Created Successfully" });
  } catch (error) {
    return res.send({ error: "sub Category Error" });
  }
};

export { categoryController, subCategoryController };
