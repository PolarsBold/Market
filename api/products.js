import express from "express";
const router = express.Router();
export default router;

import requireUser from "#middleware/requireUser";
import {
  getProducts,
  getProductById,
  getOrdersByUserIDAndProductID,
} from "#db/queries/products";

router.route("/").get(async (req, res) => {
  const products = await getProducts();
  res.status(200).send(products);
});

router.param("id", async (req, res, next, id) => {
  const product = await getProductById(id);
  if (!product) return res.status(404).send("Product does not exist");
  req.product = product;
  next();
});

router.route("/:id").get(async (req, res) => {
  res.status(200).send(req.product);
});

router.use(requireUser);

router.route("/:id/orders").get(async (req, res) => {
  const orders = await getOrdersByUserIDAndProductID(
    req.user.id,
    req.product.id
  );
  res.status(200).send(orders);
});
