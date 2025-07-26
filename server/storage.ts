import { 
  type User, 
  type InsertUser, 
  type Supplier, 
  type InsertSupplier,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type Review,
  type InsertReview,
  type Cart,
  type InsertCart,
  type CartItem,
  type InsertCartItem,
  type Payment,
  type InsertPayment
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Supplier methods
  getSupplier(id: string): Promise<Supplier | undefined>;
  getSupplierByUserId(userId: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier | undefined>;
  getSuppliers(filters?: { verified?: boolean; limit?: number }): Promise<Supplier[]>;
  getNearbySuppliers(lat: number, lng: number, radius: number): Promise<Supplier[]>;

  // Category methods
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Product methods
  getProduct(id: string): Promise<Product | undefined>;
  getProducts(filters?: { categoryId?: string; supplierId?: string; active?: boolean }): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Order methods
  getOrder(id: string): Promise<Order | undefined>;
  getOrders(filters?: { vendorId?: string; supplierId?: string; status?: string }): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;

  // Review methods
  getReviews(filters?: { supplierId?: string; vendorId?: string }): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Cart methods
  getCarts(vendorId: string): Promise<any[]>;
  getCart(cartId: string): Promise<any | undefined>;
  addToCart(vendorId: string, productId: string, quantity: number, supplierId: string): Promise<any>;
  updateCartItem(cartId: string, itemId: string, quantity: number): Promise<boolean>;
  removeCartItem(cartId: string, itemId: string): Promise<boolean>;
  clearCart(cartId: string): Promise<boolean>;

  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined>;
  getPayment(id: string): Promise<Payment | undefined>;

  // Analytics methods
  getDashboardStats(userId: string, role: string): Promise<any>;
  getPlatformAnalytics(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private suppliers: Map<string, Supplier>;
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private reviews: Map<string, Review>;
  private carts: Map<string, Cart>;
  private cartItems: Map<string, CartItem>;
  private payments: Map<string, Payment>;

  constructor() {
    this.users = new Map();
    this.suppliers = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.payments = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categories = [
      { id: randomUUID(), name: "Vegetables", description: "Fresh vegetables", icon: "fas fa-leaf", color: "green" },
      { id: randomUUID(), name: "Oils", description: "Cooking oils", icon: "fas fa-oil-can", color: "yellow" },
      { id: randomUUID(), name: "Spices", description: "Spices and masalas", icon: "fas fa-pepper-hot", color: "red" },
      { id: randomUUID(), name: "Dairy", description: "Dairy products", icon: "fas fa-glass-whiskey", color: "blue" },
      { id: randomUUID(), name: "Grains", description: "Rice, wheat, etc.", icon: "fas fa-seedling", color: "amber" },
      { id: randomUUID(), name: "Meat", description: "Fresh meat", icon: "fas fa-drumstick-bite", color: "pink" },
    ];

    categories.forEach(cat => this.categories.set(cat.id, cat));

    // Create admin user
    const adminId = randomUUID();
    const admin: User = {
      id: adminId,
      username: "admin",
      email: "admin@supplylink.com",
      password: "admin123",
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      phone: "+91-9999999999",
      isVerified: true,
      createdAt: new Date(),
    };
    this.users.set(adminId, admin);

    // Create demo vendor user
    const vendorId = randomUUID();
    const vendor: User = {
      id: vendorId,
      username: "vendor",
      email: "vendor@supplylink.com",
      password: "vendor123",
      role: "vendor",
      firstName: "Street",
      lastName: "Vendor",
      phone: "+91-8888888888",
      isVerified: true,
      createdAt: new Date(),
    };
    this.users.set(vendorId, vendor);

    // Create demo supplier user
    const supplierId = randomUUID();
    const supplier: User = {
      id: supplierId,
      username: "supplier",
      email: "supplier@supplylink.com",
      password: "supplier123",
      role: "supplier",
      firstName: "Raw",
      lastName: "Supplier",
      phone: "+91-7777777777",
      isVerified: true,
      createdAt: new Date(),
    };
    this.users.set(supplierId, supplier);

    // Create demo supplier profile
    const supplierProfile: Supplier = {
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
      createdAt: new Date(),
    };
    this.suppliers.set(supplierProfile.id, supplierProfile);

    // Add demo products for the supplier
    const demoProducts: Product[] = [
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
        imageUrl: "🥔",
        isActive: true,
        createdAt: new Date(),
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
        imageUrl: "🛢️",
        isActive: true,
        createdAt: new Date(),
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
        imageUrl: "🌶️",
        isActive: true,
        createdAt: new Date(),
      },
    ];
    demoProducts.forEach(product => this.products.set(product.id, product));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      role: insertUser.role || "vendor",
      isVerified: insertUser.isVerified || false,
      phone: insertUser.phone || null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Supplier methods
  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async getSupplierByUserId(userId: string): Promise<Supplier | undefined> {
    return Array.from(this.suppliers.values()).find(supplier => supplier.userId === userId);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = { 
      ...insertSupplier, 
      id,
      createdAt: new Date(),
      isVerified: insertSupplier.isVerified || false,
      description: insertSupplier.description || null,
      latitude: insertSupplier.latitude || null,
      longitude: insertSupplier.longitude || null,
      rating: insertSupplier.rating || null,
      totalRatings: insertSupplier.totalRatings || null,
      verificationStatus: insertSupplier.verificationStatus || "pending",
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;
    
    const updatedSupplier = { ...supplier, ...updates };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async getSuppliers(filters?: { verified?: boolean; limit?: number }): Promise<Supplier[]> {
    let suppliers = Array.from(this.suppliers.values());
    
    if (filters?.verified !== undefined) {
      suppliers = suppliers.filter(s => s.isVerified === filters.verified);
    }
    
    if (filters?.limit) {
      suppliers = suppliers.slice(0, filters.limit);
    }
    
    return suppliers;
  }

  async getNearbySuppliers(lat: number, lng: number, radius: number): Promise<Supplier[]> {
    // Simple distance calculation for demo purposes
    return Array.from(this.suppliers.values())
      .filter(s => s.isVerified)
      .slice(0, 10);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const newCategory: Category = { 
      ...category, 
      id,
      description: category.description || null,
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Product methods
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(filters?: { categoryId?: string; supplierId?: string; active?: boolean }): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (filters?.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }
    
    if (filters?.supplierId) {
      products = products.filter(p => p.supplierId === filters.supplierId);
    }
    
    if (filters?.active !== undefined) {
      products = products.filter(p => p.isActive === filters.active);
    }
    
    return products;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      createdAt: new Date(),
      description: insertProduct.description || null,
      stockQuantity: insertProduct.stockQuantity || null,
      minOrderQuantity: insertProduct.minOrderQuantity || null,
      imageUrl: insertProduct.imageUrl || null,
      isActive: insertProduct.isActive || true,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order methods
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(filters?: { vendorId?: string; supplierId?: string; status?: string }): Promise<Order[]> {
    let orders = Array.from(this.orders.values());
    
    if (filters?.vendorId) {
      orders = orders.filter(o => o.vendorId === filters.vendorId);
    }
    
    if (filters?.supplierId) {
      orders = orders.filter(o => o.supplierId === filters.supplierId);
    }
    
    if (filters?.status) {
      orders = orders.filter(o => o.status === filters.status);
    }
    
    return orders.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id: `ORD-${id.slice(0, 6).toUpperCase()}`,
      createdAt: new Date(),
      status: insertOrder.status || "pending",
      estimatedDelivery: insertOrder.estimatedDelivery || null,
      actualDelivery: insertOrder.actualDelivery || null,
      paymentMethod: insertOrder.paymentMethod || null,
      paymentStatus: insertOrder.paymentStatus || null,
      notes: insertOrder.notes || null,
    };
    this.orders.set(order.id, order);
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updates };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Review methods
  async getReviews(filters?: { supplierId?: string; vendorId?: string }): Promise<Review[]> {
    let reviews = Array.from(this.reviews.values());
    
    if (filters?.supplierId) {
      reviews = reviews.filter(r => r.supplierId === filters.supplierId);
    }
    
    if (filters?.vendorId) {
      reviews = reviews.filter(r => r.vendorId === filters.vendorId);
    }
    
    return reviews;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { 
      ...insertReview, 
      id,
      createdAt: new Date(),
      comment: insertReview.comment || null,
    };
    this.reviews.set(id, review);
    return review;
  }

  // Cart methods
  async getCarts(vendorId: string): Promise<any[]> {
    const userCarts = Array.from(this.carts.values()).filter(cart => cart.vendorId === vendorId);
    
    return userCarts.map(cart => {
      const items = Array.from(this.cartItems.values())
        .filter(item => item.cartId === cart.id)
        .map(item => {
          const product = this.products.get(item.productId);
          const supplier = this.suppliers.get(cart.supplierId);
          return {
            ...item,
            productName: product?.name || "Unknown Product",
            unit: product?.unit || "unit",
            supplierName: supplier?.businessName || "Unknown Supplier",
            imageUrl: product?.imageUrl,
            stockQuantity: product?.stockQuantity,
            minOrderQuantity: product?.minOrderQuantity,
          };
        });
      
      const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.pricePerUnit.toString()) * item.quantity), 0);
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...cart,
        items,
        totalAmount,
        totalItems,
      };
    });
  }

  async getCart(cartId: string): Promise<any | undefined> {
    const cart = this.carts.get(cartId);
    if (!cart) return undefined;

    const items = Array.from(this.cartItems.values())
      .filter(item => item.cartId === cartId)
      .map(item => {
        const product = this.products.get(item.productId);
        const supplier = this.suppliers.get(cart.supplierId);
        return {
          ...item,
          productName: product?.name || "Unknown Product",
          unit: product?.unit || "unit",
          supplierName: supplier?.businessName || "Unknown Supplier",
          imageUrl: product?.imageUrl,
          stockQuantity: product?.stockQuantity,
          minOrderQuantity: product?.minOrderQuantity,
        };
      });
    
    const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.pricePerUnit.toString()) * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      ...cart,
      items,
      totalAmount,
      totalItems,
    };
  }

  async addToCart(vendorId: string, productId: string, quantity: number, supplierId: string): Promise<any> {
    const product = this.products.get(productId);
    if (!product) throw new Error("Product not found");

    // Find or create cart for this vendor-supplier combination
    let cart = Array.from(this.carts.values())
      .find(c => c.vendorId === vendorId && c.supplierId === supplierId);
    
    if (!cart) {
      const cartId = randomUUID();
      cart = {
        id: cartId,
        vendorId,
        supplierId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.carts.set(cartId, cart);
    }

    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values())
      .find(item => item.cartId === cart.id && item.productId === productId);

    if (existingItem) {
      // Update quantity
      const updatedItem: CartItem = {
        ...existingItem,
        quantity: existingItem.quantity + quantity,
        updatedAt: new Date(),
      };
      this.cartItems.set(existingItem.id, updatedItem);
    } else {
      // Add new item
      const itemId = randomUUID();
      const cartItem: CartItem = {
        id: itemId,
        cartId: cart.id,
        productId,
        quantity,
        pricePerUnit: product.pricePerUnit,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.cartItems.set(itemId, cartItem);
    }

    // Update cart timestamp
    cart.updatedAt = new Date();
    this.carts.set(cart.id, cart);

    return this.getCart(cart.id);
  }

  async updateCartItem(cartId: string, itemId: string, quantity: number): Promise<boolean> {
    const item = this.cartItems.get(itemId);
    if (!item || item.cartId !== cartId) return false;

    if (quantity <= 0) {
      return this.removeCartItem(cartId, itemId);
    }

    const updatedItem: CartItem = {
      ...item,
      quantity,
      updatedAt: new Date(),
    };
    this.cartItems.set(itemId, updatedItem);

    // Update cart timestamp
    const cart = this.carts.get(cartId);
    if (cart) {
      cart.updatedAt = new Date();
      this.carts.set(cartId, cart);
    }

    return true;
  }

  async removeCartItem(cartId: string, itemId: string): Promise<boolean> {
    const item = this.cartItems.get(itemId);
    if (!item || item.cartId !== cartId) return false;

    this.cartItems.delete(itemId);

    // Update cart timestamp
    const cart = this.carts.get(cartId);
    if (cart) {
      cart.updatedAt = new Date();
      this.carts.set(cartId, cart);
    }

    return true;
  }

  async clearCart(cartId: string): Promise<boolean> {
    const cart = this.carts.get(cartId);
    if (!cart) return false;

    // Remove all items
    Array.from(this.cartItems.entries()).forEach(([itemId, item]) => {
      if (item.cartId === cartId) {
        this.cartItems.delete(itemId);
      }
    });

    // Remove cart
    this.carts.delete(cartId);
    return true;
  }

  // Payment methods
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      ...insertPayment,
      id,
      status: insertPayment.status || "pending",
      paymentMethod: insertPayment.paymentMethod || null,
      stripePaymentIntentId: insertPayment.stripePaymentIntentId || null,
      currency: insertPayment.currency || "inr",
      failureReason: insertPayment.failureReason || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { 
      ...payment, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  // Analytics methods
  async getDashboardStats(userId: string, role: string): Promise<any> {
    if (role === "vendor") {
      const orders = await this.getOrders({ vendorId: userId });
      const activeOrders = orders.filter(o => ["pending", "confirmed", "processing", "in_transit"].includes(o.status));
      
      return {
        activeOrders: activeOrders.length,
        nearbySuppliers: 18,
        avgRating: "4.8",
        monthlySavings: "₹2,450"
      };
    } else if (role === "supplier") {
      const products = await this.getProducts({ supplierId: userId });
      const orders = await this.getOrders({ supplierId: userId });
      
      return {
        totalProducts: products.length,
        activeOrders: orders.filter(o => o.status === "processing").length,
        monthlyRevenue: "₹45,230",
        avgRating: "4.7"
      };
    }
    
    return {};
  }

  async getPlatformAnalytics(): Promise<any> {
    const totalVendors = Array.from(this.users.values()).filter(u => u.role === "vendor").length;
    const activeSuppliers = Array.from(this.suppliers.values()).filter(s => s.isVerified).length;
    const monthlyOrders = Array.from(this.orders.values()).length;
    const revenue = Array.from(this.orders.values())
      .reduce((sum, order) => sum + parseFloat(order.totalAmount || "0"), 0);
    
    return {
      totalVendors,
      activeSuppliers,
      monthlyOrders,
      revenue: `₹${(revenue / 100000).toFixed(1)}M`
    };
  }
}

export const storage = new MemStorage();
