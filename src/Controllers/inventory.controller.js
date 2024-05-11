import { Inventory } from "../Models/inventory.model.js";
import { Product } from "../Models/product.model.js";

const inventoryController = async (req, res) => {
  try {
    const {
      buyPrice,
      sellPrice,
      discountPrice,
      discountPercentage,
      quantity,
      inStock,
      productName,
    } = req.body;

    if (
      [
        buyPrice,
        sellPrice,
        discountPrice,
        discountPercentage,
        quantity,
        inStock,
        productName,
      ].some((field) => field.trim() === "")
    ) {
      return res
        .status(406)
        .send({ error: "name and details field are required" });
    }
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.send({ error: "invalid Product access in inventory" });
    }
    const newInventory = new Inventory({
      product: product?._id,
      buyPrice: Number(buyPrice),
      sellPrice: Number(sellPrice),
      discountPercentage: Number(discountPercentage),
      discountPrice: Number(discountPrice),
      quantity: Number(quantity),
      inStock: Number(inStock),
    });
    const save = await newInventory.save({ validateBeforeSave: false });

    product.inventory = save?._id;
    await product.save({ validateBeforeSave: false });

    if (save) {
      return res.status(200).send({
        success: true,
        message: "Inventory Create Successfully",
        data: save,
      });
    }
  } catch (error) {
    return res.send({ error: "inventory Error" });
  }
};

export { inventoryController };
