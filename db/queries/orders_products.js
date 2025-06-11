import db from "#db/client";

export async function createOrders_Products(product_id, order_id, quantity) {
  const sql = `INSERT INTO orders_products(product_id, order_id, quantity) VALUES($1, $2, $3) RETURNING *`;
  const {
    rows: [order_product],
  } = await db.query(sql, [product_id, order_id, quantity]);
  return order_product;
}
