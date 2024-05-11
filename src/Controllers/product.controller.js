import { Category } from "../Models/category.model.js";
import { Product } from "../Models/product.model.js";
import cloudinaryService from "../Utils/cloudinary.service.js";

const productController = async (req, res) => {
  try {
    const { name, details, categoryName } = req.body;
    if ([name, details, categoryName].some((field) => field.trim() === "")) {
      return res.status(406).send({ error: "all fields are required" });
    }
    const exists = await Product.findOne({ name });
    if (exists) {
      return res.status(406).send({ error: "Product Name Must Be Unique" });
    }
    const { productFeaturedImage, thumbnail } = req.files;
    if (!productFeaturedImage) {
      return res.send({ error: "productFeatured Image required" });
    }
    if (!thumbnail) {
      return res.send({ error: "product thumbnail Image required" });
    }
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.send({ error: "Invalid Access Category" });
    }
    const featuredImagePath = productFeaturedImage[0]?.path;

    const uploadFeaturedImag = await cloudinaryService(featuredImagePath);

    let thumbnailPath = [];
    // !use for of loop
    // for (let img of thumbnail) {
    //   const response = await cloudinaryService(img.path);
    //   if (response) {
    //     thumbnailPath.push(response?.url);
    //   }
    // }
    // ! use for loop
    // for (let index = 0; index < thumbnail.length; index++) {
    //   const { path } = thumbnail[index];
    //   const response = await cloudinaryService(path);
    //   if (response) {
    //     thumbnailPath.push(response?.url);
    //   }
    // }

    // !use map and get all promise
    const promise = await thumbnail?.map((img) => cloudinaryService(img?.path));
    const allPaths = await Promise.all(promise);
    const getAllUrl = await allPaths?.map((path) => path?.url);

    if (!(uploadFeaturedImag && getAllUrl)) {
      return res.send({ error: "Upload Error" });
    }

    const newProduct = new Product({
      name,
      details,
      category: category?._id,
      whoCreated: req?.user?._id,
      slug: name,
      thumbnail: getAllUrl,
      productFeaturedImage: uploadFeaturedImag?.url,
    });
    const save = await newProduct.save({ validateBeforeSave: false });
    if (save) {
      return res.status(200).send({
        success: true,
        message: "Product Added Successfully",
        data: save,
      });
    }
  } catch (error) {
    return res.status(400).send({ error: "Product Controller Error" });
  }
};

export { productController };
