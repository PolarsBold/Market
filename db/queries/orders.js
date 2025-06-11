import db from "#db/client";

export async function createOrder(date, note, user_id) {
  const sql = `INSERT INTO orders(date, note, user_id) VALUES($1, $2, $3) RETURNING *`;
  const {
    rows: [order],
  } = await db.query(sql, [date, note, user_id]);
  return order;
}

export async function getOrdersByUserId(id) {
  const sql = `SELECT * FROM orders WHERE user_id = $1`;
  const { rows: orders } = await db.query(sql, [id]);
  return orders;
}

export async function getOrderById(id) {
  const sql = `SELECT * FROM orders WHERE id = $1`;
  const {
    rows: [order],
  } = await db.query(sql, [id]);
  return order;
}

export async function getProductsByOrderId(id) {
  const sql = `SELECT * FROM orders_products
JOIN products ON products.id = orders_products.product_id
WHERE orders_products.order_id = $1; `;
  const { rows: products } = await db.query(sql, [id]);
  return products;
}
