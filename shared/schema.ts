import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("vendor"), // vendor, supplier, admin
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  businessName: text("business_name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  totalRatings: integer("total_ratings").default(0),
  isVerified: boolean("is_verified").default(false),
  verificationStatus: text("verification_status").default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull(),
  categoryId: varchar("category_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  unit: text("unit").notNull(), // kg, liter, piece
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer("stock_quantity").default(0),
  minOrderQuantity: integer("min_order_quantity").default(1),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").notNull(),
  supplierId: varchar("supplier_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, processing, in_transit, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  items: jsonb("items").notNull(), // array of order items
  deliveryAddress: text("delivery_address").notNull(),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  paymentMethod: text("payment_method").default("cod"), // cod, online
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  vendorId: varchar("vendor_id").notNull(),
  supplierId: varchar("supplier_id").notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const carts = pgTable("carts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").notNull(),
  supplierId: varchar("supplier_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cartId: varchar("cart_id").notNull(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("inr"),
  status: text("status").notNull().default("pending"), // pending, processing, succeeded, failed, canceled
  paymentMethod: text("payment_method"), // card, upi, netbanking, wallet
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register schema
export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Cart = typeof carts.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
