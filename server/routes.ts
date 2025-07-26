import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { loginSchema, registerSchema, insertSupplierSchema, insertProductSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

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

  // Cart routes
  app.get("/api/carts/:vendorId", async (req, res) => {
    try {
      const carts = await storage.getCarts(req.params.vendorId);
      res.json(carts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/carts/add", async (req, res) => {
    try {
      const { productId, quantity, supplierId, vendorId } = req.body;
      
      if (!vendorId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const cart = await storage.addToCart(vendorId, productId, quantity, supplierId);
      res.json(cart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/carts/:cartId/items/:itemId", async (req, res) => {
    try {
      const { cartId, itemId } = req.params;
      const { quantity } = req.body;
      
      const success = await storage.updateCartItem(cartId, itemId, quantity);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Cart item not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/carts/:cartId/items/:itemId", async (req, res) => {
    try {
      const { cartId, itemId } = req.params;
      
      const success = await storage.removeCartItem(cartId, itemId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Cart item not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/carts/:cartId", async (req, res) => {
    try {
      const { cartId } = req.params;
      
      const success = await storage.clearCart(cartId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { cartId, deliveryAddress, notes, paymentMethod } = req.body;
      
      const cart = await storage.getCart(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      if (paymentMethod === "cod") {
        // For Cash on Delivery, create order directly
        const order = await storage.createOrder({
          vendorId: cart.vendorId,
          supplierId: cart.supplierId,
          totalAmount: (cart.totalAmount * 1.18).toFixed(2), // Including GST
          deliveryAddress,
          notes: notes || null,
          status: "pending",
          paymentMethod: "cod",
          items: JSON.stringify(cart.items),
        });

        // Clear cart after successful order
        await storage.clearCart(cartId);

        return res.json({ 
          success: true, 
          orderId: order.id,
          url: `/orders?success=true&order_id=${order.id}` 
        });
      }

      // For Stripe payments
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cart.items.map((item: any) => ({
          price_data: {
            currency: "inr",
            product_data: {
              name: item.productName,
              description: `From ${item.supplierName}`,
            },
            unit_amount: Math.round(item.pricePerUnit * 100), // Convert to paise
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${process.env.DOMAIN || 'http://localhost:5000'}/orders?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.DOMAIN || 'http://localhost:5000'}/cart`,
        metadata: {
          cartId,
          deliveryAddress,
          notes: notes || "",
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Checkout error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe webhook for handling successful payments
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { cartId, deliveryAddress, notes } = session.metadata!;

      try {
        const cart = await storage.getCart(cartId);
        if (cart) {
          // Create order
          const order = await storage.createOrder({
            vendorId: cart.vendorId,
            supplierId: cart.supplierId,
            totalAmount: (session.amount_total! / 100).toFixed(2),
            deliveryAddress,
            notes: notes || null,
            status: "confirmed",
            paymentMethod: "stripe",
            items: JSON.stringify(cart.items),
          });

          // Create payment record
          await storage.createPayment({
            orderId: order.id,
            amount: (session.amount_total! / 100).toFixed(2),
            status: "completed",
            paymentMethod: "stripe",
            stripePaymentIntentId: session.payment_intent as string,
            currency: "inr",
          });

          // Clear cart
          await storage.clearCart(cartId);
        }
      } catch (error) {
        console.error("Error processing successful payment:", error);
      }
    }

    res.json({ received: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
