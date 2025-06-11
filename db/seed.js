import db from "#db/client";
import { createOrders_Products } from "#db/queries/orders_products";
import { createOrder } from "#db/queries/orders";
import { createProduct } from "#db/queries/products";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user = ["Polars", "password1234"];
  await createUser(user[0], user[1]);

  const order = ["2025-06-10", "Test order", 1];
  await createOrder(order[0], order[1], order[2]);

  for (let i = 1; i <= 10; i++) {
    const price = Math.floor(Math.random() * 25 + 1);
    await createProduct("Product " + i, "Test description", price);
  }

  for (let i = 1; i <= 5; i++) {
    const quantity = Math.floor(Math.random() * 50);
    await createOrders_Products(1, i, quantity);
  }
}
