// server/index.ts
import dotenv2 from "dotenv";
import express2 from "express";

// server/routes.ts
import dotenv from "dotenv";
import { createServer } from "http";
import Stripe from "stripe";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  suppliers;
  categories;
  products;
  orders;
  reviews;
  carts;
  cartItems;
  payments;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.suppliers = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.orders = /* @__PURE__ */ new Map();
    this.reviews = /* @__PURE__ */ new Map();
    this.carts = /* @__PURE__ */ new Map();
    this.cartItems = /* @__PURE__ */ new Map();
    this.payments = /* @__PURE__ */ new Map();
    this.initializeData();
  }
  initializeData() {
    const categories2 = [
      { id: randomUUID(), name: "Vegetables", description: "Fresh vegetables", icon: "fas fa-leaf", color: "green" },
      { id: randomUUID(), name: "Oils", description: "Cooking oils", icon: "fas fa-oil-can", color: "yellow" },
      { id: randomUUID(), name: "Spices", description: "Spices and masalas", icon: "fas fa-pepper-hot", color: "red" },
      { id: randomUUID(), name: "Dairy", description: "Dairy products", icon: "fas fa-glass-whiskey", color: "blue" },
      { id: randomUUID(), name: "Grains", description: "Rice, wheat, etc.", icon: "fas fa-seedling", color: "amber" },
      { id: randomUUID(), name: "Meat", description: "Fresh meat", icon: "fas fa-drumstick-bite", color: "pink" }
    ];
    categories2.forEach((cat) => this.categories.set(cat.id, cat));
    const adminId = randomUUID();
    const admin = {
      id: adminId,
      username: "admin",
      email: "admin@supplylink.com",
      password: "admin123",
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      phone: "+91-9999999999",
      isVerified: true,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(adminId, admin);
    const vendorId = randomUUID();
    const vendor = {
      id: vendorId,
      username: "vendor",
      email: "vendor@supplylink.com",
      password: "vendor123",
      role: "vendor",
      firstName: "Street",
      lastName: "Vendor",
      phone: "+91-8888888888",
      isVerified: true,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(vendorId, vendor);
    const supplierId = randomUUID();
    const supplier = {
      id: supplierId,
      username: "supplier",
      email: "supplier@supplylink.com",
      password: "supplier123",
      role: "supplier",
      firstName: "Raw",
      lastName: "Supplier",
      phone: "+91-7777777777",
      isVerified: true,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(supplierId, supplier);
    const supplierProfile = {
      id: randomUUID(),
      userId: supplierId,
      businessName: "Fresh Farm Supplies",
      description: "Premium quality raw materials for street food vendors",
      address: "123 Market Street, Mumbai, Maharashtra",
      latitude: "19.0760",
      longitude: "72.8777",
      rating: "4.8",
      totalRatings: 150,
      isVerified: true,
      verificationStatus: "approved",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.suppliers.set(supplierProfile.id, supplierProfile);
    const demoProducts = [
      {
        id: randomUUID(),
        supplierId: supplierProfile.id,
        categoryId: Array.from(this.categories.values())[0]?.id || "",
        name: "Red Onions",
        description: "Premium quality red onions from local farms",
        unit: "kg",
        pricePerUnit: "35",
        stockQuantity: 150,
        minOrderQuantity: 10,
        imageUrl: "\u{1F954}",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        supplierId: supplierProfile.id,
        categoryId: Array.from(this.categories.values())[1]?.id || "",
        name: "Sunflower Oil",
        description: "Refined sunflower oil for cooking",
        unit: "liter",
        pricePerUnit: "120",
        stockQuantity: 45,
        minOrderQuantity: 5,
        imageUrl: "\u{1F6E2}\uFE0F",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        supplierId: supplierProfile.id,
        categoryId: Array.from(this.categories.values())[2]?.id || "",
        name: "Garam Masala",
        description: "Authentic spice blend for Indian cuisine",
        unit: "kg",
        pricePerUnit: "250",
        stockQuantity: 2,
        minOrderQuantity: 1,
        imageUrl: "\u{1F336}\uFE0F",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    demoProducts.forEach((product) => this.products.set(product.id, product));
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      role: insertUser.role || "vendor",
      isVerified: insertUser.isVerified || false,
      phone: insertUser.phone || null
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Supplier methods
  async getSupplier(id) {
    return this.suppliers.get(id);
  }
  async getSupplierByUserId(userId) {
    return Array.from(this.suppliers.values()).find((supplier) => supplier.userId === userId);
  }
  async createSupplier(insertSupplier) {
    const id = randomUUID();
    const supplier = {
      ...insertSupplier,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      isVerified: insertSupplier.isVerified || false,
      description: insertSupplier.description || null,
      latitude: insertSupplier.latitude || null,
      longitude: insertSupplier.longitude || null,
      rating: insertSupplier.rating || null,
      totalRatings: insertSupplier.totalRatings || null,
      verificationStatus: insertSupplier.verificationStatus || "pending"
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }
  async updateSupplier(id, updates) {
    const supplier = this.suppliers.get(id);
    if (!supplier) return void 0;
    const updatedSupplier = { ...supplier, ...updates };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }
  async getSuppliers(filters) {
    let suppliers2 = Array.from(this.suppliers.values());
    if (filters?.verified !== void 0) {
      suppliers2 = suppliers2.filter((s) => s.isVerified === filters.verified);
    }
    if (filters?.limit) {
      suppliers2 = suppliers2.slice(0, filters.limit);
    }
    return suppliers2;
  }
  async getNearbySuppliers(lat, lng, radius) {
    return Array.from(this.suppliers.values()).filter((s) => s.isVerified).slice(0, 10);
  }
  // Category methods
  async getCategories() {
    return Array.from(this.categories.values());
  }
  async createCategory(category) {
    const id = randomUUID();
    const newCategory = {
      ...category,
      id,
      description: category.description || null
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  // Product methods
  async getProduct(id) {
    return this.products.get(id);
  }
  async getProducts(filters) {
    let products2 = Array.from(this.products.values());
    if (filters?.categoryId) {
      products2 = products2.filter((p) => p.categoryId === filters.categoryId);
    }
    if (filters?.supplierId) {
      products2 = products2.filter((p) => p.supplierId === filters.supplierId);
    }
    if (filters?.active !== void 0) {
      products2 = products2.filter((p) => p.isActive === filters.active);
    }
    return products2;
  }
  async createProduct(insertProduct) {
    const id = randomUUID();
    const product = {
      ...insertProduct,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      description: insertProduct.description || null,
      stockQuantity: insertProduct.stockQuantity || null,
      minOrderQuantity: insertProduct.minOrderQuantity || null,
      imageUrl: insertProduct.imageUrl || null,
      isActive: insertProduct.isActive || true
    };
    this.products.set(id, product);
    return product;
  }
  async updateProduct(id, updates) {
    const product = this.products.get(id);
    if (!product) return void 0;
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  async deleteProduct(id) {
    return this.products.delete(id);
  }
  // Order methods
  async getOrder(id) {
    return this.orders.get(id);
  }
  async getOrders(filters) {
    let orders2 = Array.from(this.orders.values());
    if (filters?.vendorId) {
      orders2 = orders2.filter((o) => o.vendorId === filters.vendorId);
    }
    if (filters?.supplierId) {
      orders2 = orders2.filter((o) => o.supplierId === filters.supplierId);
    }
    if (filters?.status) {
      orders2 = orders2.filter((o) => o.status === filters.status);
    }
    return orders2.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async createOrder(insertOrder) {
    const id = randomUUID();
    const order = {
      ...insertOrder,
      id: `ORD-${id.slice(0, 6).toUpperCase()}`,
      createdAt: /* @__PURE__ */ new Date(),
      status: insertOrder.status || "pending",
      estimatedDelivery: insertOrder.estimatedDelivery || null,
      actualDelivery: insertOrder.actualDelivery || null,
      paymentMethod: insertOrder.paymentMethod || null,
      paymentStatus: insertOrder.paymentStatus || null,
      notes: insertOrder.notes || null
    };
    this.orders.set(order.id, order);
    return order;
  }
  async updateOrder(id, updates) {
    const order = this.orders.get(id);
    if (!order) return void 0;
    const updatedOrder = { ...order, ...updates };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  // Review methods
  async getReviews(filters) {
    let reviews2 = Array.from(this.reviews.values());
    if (filters?.supplierId) {
      reviews2 = reviews2.filter((r) => r.supplierId === filters.supplierId);
    }
    if (filters?.vendorId) {
      reviews2 = reviews2.filter((r) => r.vendorId === filters.vendorId);
    }
    return reviews2;
  }
  async createReview(insertReview) {
    const id = randomUUID();
    const review = {
      ...insertReview,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      comment: insertReview.comment || null
    };
    this.reviews.set(id, review);
    return review;
  }
  // Cart methods
  async getCarts(vendorId) {
    const userCarts = Array.from(this.carts.values()).filter((cart) => cart.vendorId === vendorId);
    return userCarts.map((cart) => {
      const items = Array.from(this.cartItems.values()).filter((item) => item.cartId === cart.id).map((item) => {
        const product = this.products.get(item.productId);
        const supplier = this.suppliers.get(cart.supplierId);
        return {
          ...item,
          productName: product?.name || "Unknown Product",
          unit: product?.unit || "unit",
          supplierName: supplier?.businessName || "Unknown Supplier",
          imageUrl: product?.imageUrl,
          stockQuantity: product?.stockQuantity,
          minOrderQuantity: product?.minOrderQuantity
        };
      });
      const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.pricePerUnit.toString()) * item.quantity, 0);
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      return {
        ...cart,
        items,
        totalAmount,
        totalItems
      };
    });
  }
  async getCart(cartId) {
    const cart = this.carts.get(cartId);
    if (!cart) return void 0;
    const items = Array.from(this.cartItems.values()).filter((item) => item.cartId === cartId).map((item) => {
      const product = this.products.get(item.productId);
      const supplier = this.suppliers.get(cart.supplierId);
      return {
        ...item,
        productName: product?.name || "Unknown Product",
        unit: product?.unit || "unit",
        supplierName: supplier?.businessName || "Unknown Supplier",
        imageUrl: product?.imageUrl,
        stockQuantity: product?.stockQuantity,
        minOrderQuantity: product?.minOrderQuantity
      };
    });
    const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.pricePerUnit.toString()) * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return {
      ...cart,
      items,
      totalAmount,
      totalItems
    };
  }
  async addToCart(vendorId, productId, quantity, supplierId) {
    const product = this.products.get(productId);
    if (!product) throw new Error("Product not found");
    let cart = Array.from(this.carts.values()).find((c) => c.vendorId === vendorId && c.supplierId === supplierId);
    if (!cart) {
      const cartId = randomUUID();
      cart = {
        id: cartId,
        vendorId,
        supplierId,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.carts.set(cartId, cart);
    }
    const existingItem = Array.from(this.cartItems.values()).find((item) => item.cartId === cart.id && item.productId === productId);
    if (existingItem) {
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + quantity,
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.cartItems.set(existingItem.id, updatedItem);
    } else {
      const itemId = randomUUID();
      const cartItem = {
        id: itemId,
        cartId: cart.id,
        productId,
        quantity,
        pricePerUnit: product.pricePerUnit,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.cartItems.set(itemId, cartItem);
    }
    cart.updatedAt = /* @__PURE__ */ new Date();
    this.carts.set(cart.id, cart);
    return this.getCart(cart.id);
  }
  async updateCartItem(cartId, itemId, quantity) {
    const item = this.cartItems.get(itemId);
    if (!item || item.cartId !== cartId) return false;
    if (quantity <= 0) {
      return this.removeCartItem(cartId, itemId);
    }
    const updatedItem = {
      ...item,
      quantity,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.cartItems.set(itemId, updatedItem);
    const cart = this.carts.get(cartId);
    if (cart) {
      cart.updatedAt = /* @__PURE__ */ new Date();
      this.carts.set(cartId, cart);
    }
    return true;
  }
  async removeCartItem(cartId, itemId) {
    const item = this.cartItems.get(itemId);
    if (!item || item.cartId !== cartId) return false;
    this.cartItems.delete(itemId);
    const cart = this.carts.get(cartId);
    if (cart) {
      cart.updatedAt = /* @__PURE__ */ new Date();
      this.carts.set(cartId, cart);
    }
    return true;
  }
  async clearCart(cartId) {
    const cart = this.carts.get(cartId);
    if (!cart) return false;
    Array.from(this.cartItems.entries()).forEach(([itemId, item]) => {
      if (item.cartId === cartId) {
        this.cartItems.delete(itemId);
      }
    });
    this.carts.delete(cartId);
    return true;
  }
  // Payment methods
  async createPayment(insertPayment) {
    const id = randomUUID();
    const payment = {
      ...insertPayment,
      id,
      status: insertPayment.status || "pending",
      paymentMethod: insertPayment.paymentMethod || null,
      stripePaymentIntentId: insertPayment.stripePaymentIntentId || null,
      currency: insertPayment.currency || "inr",
      failureReason: insertPayment.failureReason || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.payments.set(id, payment);
    return payment;
  }
  async updatePayment(id, updates) {
    const payment = this.payments.get(id);
    if (!payment) return void 0;
    const updatedPayment = {
      ...payment,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
  async getPayment(id) {
    return this.payments.get(id);
  }
  // Analytics methods
  async getDashboardStats(userId, role) {
    if (role === "vendor") {
      const orders2 = await this.getOrders({ vendorId: userId });
      const activeOrders = orders2.filter((o) => ["pending", "confirmed", "processing", "in_transit"].includes(o.status));
      return {
        activeOrders: activeOrders.length,
        nearbySuppliers: 18,
        avgRating: "4.8",
        monthlySavings: "\u20B92,450"
      };
    } else if (role === "supplier") {
      const products2 = await this.getProducts({ supplierId: userId });
      const orders2 = await this.getOrders({ supplierId: userId });
      return {
        totalProducts: products2.length,
        activeOrders: orders2.filter((o) => o.status === "processing").length,
        monthlyRevenue: "\u20B945,230",
        avgRating: "4.7"
      };
    }
    return {};
  }
  async getPlatformAnalytics() {
    const totalVendors = Array.from(this.users.values()).filter((u) => u.role === "vendor").length;
    const activeSuppliers = Array.from(this.suppliers.values()).filter((s) => s.isVerified).length;
    const monthlyOrders = Array.from(this.orders.values()).length;
    const revenue = Array.from(this.orders.values()).reduce((sum, order) => sum + parseFloat(order.totalAmount || "0"), 0);
    return {
      totalVendors,
      activeSuppliers,
      monthlyOrders,
      revenue: `\u20B9${(revenue / 1e5).toFixed(1)}M`
    };
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("vendor"),
  // vendor, supplier, admin
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var suppliers = pgTable("suppliers", {
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
  verificationStatus: text("verification_status").default("pending"),
  // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow()
});
var categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").notNull()
});
var products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull(),
  categoryId: varchar("category_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  unit: text("unit").notNull(),
  // kg, liter, piece
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer("stock_quantity").default(0),
  minOrderQuantity: integer("min_order_quantity").default(1),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").notNull(),
  supplierId: varchar("supplier_id").notNull(),
  status: text("status").notNull().default("pending"),
  // pending, confirmed, processing, in_transit, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  items: jsonb("items").notNull(),
  // array of order items
  deliveryAddress: text("delivery_address").notNull(),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  paymentMethod: text("payment_method").default("cod"),
  // cod, online
  paymentStatus: text("payment_status").default("pending"),
  // pending, paid, failed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  vendorId: varchar("vendor_id").notNull(),
  supplierId: varchar("supplier_id").notNull(),
  rating: integer("rating").notNull(),
  // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow()
});
var carts = pgTable("carts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").notNull(),
  supplierId: varchar("supplier_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cartId: varchar("cart_id").notNull(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("inr"),
  status: text("status").notNull().default("pending"),
  // pending, processing, succeeded, failed, canceled
  paymentMethod: text("payment_method"),
  // card, upi, netbanking, wallet
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
});
var insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
var registerSchema = insertUserSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// server/routes.ts
dotenv.config();
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil"
});
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const supplier = user.role === "supplier" ? await storage.getSupplierByUserId(user.id) : null;
      res.json({
        user: { ...user, password: void 0 },
        supplier
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const user = await storage.createUser({
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone
      });
      res.json({ user: { ...user, password: void 0 } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ ...user, password: void 0 });
  });
  app2.get("/api/suppliers", async (req, res) => {
    const verified = req.query.verified === "true";
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const suppliers2 = await storage.getSuppliers({ verified, limit });
    res.json(suppliers2);
  });
  app2.get("/api/suppliers/nearby", async (req, res) => {
    const lat = parseFloat(req.query.lat) || 0;
    const lng = parseFloat(req.query.lng) || 0;
    const radius = parseFloat(req.query.radius) || 10;
    const suppliers2 = await storage.getNearbySuppliers(lat, lng, radius);
    res.json(suppliers2);
  });
  app2.post("/api/suppliers", async (req, res) => {
    try {
      const data = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(data);
      res.json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.put("/api/suppliers/:id", async (req, res) => {
    const supplier = await storage.updateSupplier(req.params.id, req.body);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(supplier);
  });
  app2.get("/api/suppliers/pending", async (req, res) => {
    const suppliers2 = await storage.getSuppliers({ verified: false });
    res.json(suppliers2);
  });
  app2.get("/api/categories", async (req, res) => {
    const categories2 = await storage.getCategories();
    res.json(categories2);
  });
  app2.get("/api/products", async (req, res) => {
    const categoryId = req.query.categoryId;
    const supplierId = req.query.supplierId;
    const active = req.query.active === "true";
    const products2 = await storage.getProducts({ categoryId, supplierId, active });
    res.json(products2);
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.put("/api/products/:id", async (req, res) => {
    const product = await storage.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });
  app2.delete("/api/products/:id", async (req, res) => {
    const deleted = await storage.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  });
  app2.get("/api/orders", async (req, res) => {
    const vendorId = req.query.vendorId;
    const supplierId = req.query.supplierId;
    const status = req.query.status;
    const orders2 = await storage.getOrders({ vendorId, supplierId, status });
    res.json(orders2);
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const data = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(data);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.put("/api/orders/:id", async (req, res) => {
    const order = await storage.updateOrder(req.params.id, req.body);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  });
  app2.get("/api/dashboard/stats/:userId/:role", async (req, res) => {
    const { userId, role } = req.params;
    const stats = await storage.getDashboardStats(userId, role);
    res.json(stats);
  });
  app2.get("/api/admin/analytics", async (req, res) => {
    const analytics = await storage.getPlatformAnalytics();
    res.json(analytics);
  });
  app2.get("/api/carts/:vendorId", async (req, res) => {
    try {
      const carts2 = await storage.getCarts(req.params.vendorId);
      res.json(carts2);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/carts/add", async (req, res) => {
    try {
      const { productId, quantity, supplierId, vendorId } = req.body;
      if (!vendorId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const cart = await storage.addToCart(vendorId, productId, quantity, supplierId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.put("/api/carts/:cartId/items/:itemId", async (req, res) => {
    try {
      const { cartId, itemId } = req.params;
      const { quantity } = req.body;
      const success = await storage.updateCartItem(cartId, itemId, quantity);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Cart item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/carts/:cartId/items/:itemId", async (req, res) => {
    try {
      const { cartId, itemId } = req.params;
      const success = await storage.removeCartItem(cartId, itemId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Cart item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.delete("/api/carts/:cartId", async (req, res) => {
    try {
      const { cartId } = req.params;
      const success = await storage.clearCart(cartId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { cartId, deliveryAddress, notes, paymentMethod } = req.body;
      const cart = await storage.getCart(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      if (paymentMethod === "cod") {
        const order = await storage.createOrder({
          vendorId: cart.vendorId,
          supplierId: cart.supplierId,
          totalAmount: (cart.totalAmount * 1.18).toFixed(2),
          // Including GST
          deliveryAddress,
          notes: notes || null,
          status: "pending",
          paymentMethod: "cod",
          items: JSON.stringify(cart.items)
        });
        await storage.clearCart(cartId);
        return res.json({
          success: true,
          orderId: order.id,
          url: `/orders?success=true&order_id=${order.id}`
        });
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cart.items.map((item) => ({
          price_data: {
            currency: "inr",
            product_data: {
              name: item.productName,
              description: `From ${item.supplierName}`
            },
            unit_amount: Math.round(item.pricePerUnit * 100)
            // Convert to paise
          },
          quantity: item.quantity
        })),
        mode: "payment",
        success_url: `${process.env.DOMAIN || "http://localhost:5000"}/orders?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.DOMAIN || "http://localhost:5000"}/cart`,
        metadata: {
          cartId,
          deliveryAddress,
          notes: notes || ""
        }
      });
      res.json({ url: session.url });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { cartId, deliveryAddress, notes } = session.metadata;
      try {
        const cart = await storage.getCart(cartId);
        if (cart) {
          const order = await storage.createOrder({
            vendorId: cart.vendorId,
            supplierId: cart.supplierId,
            totalAmount: (session.amount_total / 100).toFixed(2),
            deliveryAddress,
            notes: notes || null,
            status: "confirmed",
            paymentMethod: "stripe",
            items: JSON.stringify(cart.items)
          });
          await storage.createPayment({
            orderId: order.id,
            amount: (session.amount_total / 100).toFixed(2),
            status: "completed",
            paymentMethod: "stripe",
            stripePaymentIntentId: session.payment_intent,
            currency: "inr"
          });
          await storage.clearCart(cartId);
        }
      } catch (error) {
        console.error("Error processing successful payment:", error);
      }
    }
    res.json({ received: true });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv2.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
