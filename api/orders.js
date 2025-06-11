import express from "express";
const router = express.Router();
export default router;

import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  getProductsByOrderId,
} from "#db/queries/orders";
import { createOrders_Products } from "#db/queries/orders_products";

router.use(requireUser);

router
  .route("/")
  .post(requireBody(["date"]), async (req, res) => {
    const { date } = req.body;
    const order = await createOrder(date, req.body.note, req.user.id);
    res.status(201).send(order);
  })
  .get(async (req, res) => {
    const orders = await getOrdersByUserId(req.user.id);
    res.status(200).send(orders);
  });

router.param("id", async (req, res, next, id) => {
  const order = await getOrderById(id);
  if (!order) return res.status(404).send("Order does not exist");
  req.order = order;
  if (req.user.id != req.order.user_id)
    return res.status(403).json({ message: "You do not own this order" });
  next();
});

router.route("/:id").get(async (req, res) => {
  res.status(200).send(req.order);
});

router
  .route("/:id/products")
  .post(requireBody(["productId", "quantity"]), async (req, res) => {
    const { productId, quantity } = req.body;
    const order = await createOrders_Products(
      productId,
      req.order.id,
      quantity
    );
    if (!order)
      return res.status(400).json({ message: "Product does not exist" });
    res.status(201).send(order);
  })
  .get(async (req, res) => {
    const products = await getProductsByOrderId(req.order.id);
    res.status(200).send(products);
  });
