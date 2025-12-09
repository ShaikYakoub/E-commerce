import "dotenv/config"; // 👈 ADD THIS LINE AT THE VERY TOP
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Clean Database (Optional: careful in production!)
  await db.review.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.cartItem.deleteMany();
  await db.cart.deleteMany();
  await db.product.deleteMany();
  await db.user.deleteMany();

  // 2. Create Users
  const password = await bcrypt.hash("password123", 10);

  const seller = await db.user.create({
    data: {
      email: "seller@test.com",
      name: "Tech World Inc",
      password,
      role: "ADMIN", 
    },
  });

  const buyer = await db.user.create({
    data: {
      email: "buyer@test.com",
      name: "John Doe",
      password,
      role: "USER",
    },
  });

  // 3. Create Products
  await db.product.create({
    data: {
      name: "MacBook Pro M3",
      description: "The latest powerhouse from Apple with the M3 Max chip. 16-inch Liquid Retina XDR display, 36GB Unified Memory, 1TB SSD.",
      category: "electronics",
      price: 199900.00,
      stock: 10,
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      sellerId: seller.id,
    },
  });

  await db.product.create({
    data: {
      name: "Ergonomic Office Chair",
      description: "High-back mesh chair with lumbar support, adjustable headrest, and armrests. Perfect for long coding sessions.",
      category: "furniture",
      price: 12500.00,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80",
      sellerId: seller.id,
    },
  });

  console.log("✅ Database seeded successfully");
  console.log("   Seller: seller@test.com / password123");
  console.log("   Buyer:  buyer@test.com  / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });