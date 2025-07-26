import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, registerSchema, insertSupplierSchema, insertProductSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const supplier = user.role === "supplier" ? await storage.getSupplierByUserId(user.id) : null;
      
      res.json({ 
        user: { ...user, password: undefined },
        supplier 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      
      // Check if user already exists
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
        phone: data.phone,
      });

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ ...user, password: undefined });
  });

  // Supplier routes
  app.get("/api/suppliers", async (req, res) => {
    const verified = req.query.verified === "true";
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const suppliers = await storage.getSuppliers({ verified, limit });
    res.json(suppliers);
  });

  app.get("/api/suppliers/nearby", async (req, res) => {
    const lat = parseFloat(req.query.lat as string) || 0;
    const lng = parseFloat(req.query.lng as string) || 0;
    const radius = parseFloat(req.query.radius as string) || 10;
    
    const suppliers = await storage.getNearbySuppliers(lat, lng, radius);
    res.json(suppliers);
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const data = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(data);
      res.json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    const supplier = await storage.updateSupplier(req.params.id, req.body);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(supplier);
  });

  app.get("/api/suppliers/pending", async (req, res) => {
    const suppliers = await storage.getSuppliers({ verified: false });
    res.json(suppliers);
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    const categoryId = req.query.categoryId as string;
    const supplierId = req.query.supplierId as string;
    const active = req.query.active === "true";
    
    const products = await storage.getProducts({ categoryId, supplierId, active });
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    const product = await storage.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.delete("/api/products/:id", async (req, res) => {
    const deleted = await storage.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    const vendorId = req.query.vendorId as string;
    const supplierId = req.query.supplierId as string;
    const status = req.query.status as string;
    
    const orders = await storage.getOrders({ vendorId, supplierId, status });
    res.json(orders);
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const data = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(data);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    const order = await storage.updateOrder(req.params.id, req.body);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  });

  // Dashboard stats
  app.get("/api/dashboard/stats/:userId/:role", async (req, res) => {
    const { userId, role } = req.params;
    const stats = await storage.getDashboardStats(userId, role);
    res.json(stats);
  });

  // Platform analytics
  app.get("/api/admin/analytics", async (req, res) => {
    const analytics = await storage.getPlatformAnalytics();
    res.json(analytics);
  });

  const httpServer = createServer(app);
  return httpServer;
}
