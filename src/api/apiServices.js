import API from "../api";

// Generic error handler for logging
const handleApiError = (error, message) => {
  console.error(`${message}:`, error.response?.data || error.message);
};

// Fetch all products
export const fetchProducts = async () => {
  try {
    const { data } = await API.get("/products");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleApiError(error, "Error fetching products");
    return [];
  }
};

// Fetch a single product by ID
export const fetchProductById = async (id) => {
  try {
    const { data } = await API.get(`/products/${id}`);
    return data || null;
  } catch (error) {
    handleApiError(error, `Error fetching product (ID: ${id})`);
    return null;
  }
};

// Fetch user orders
export const fetchOrders = async () => {
  try {
    const { data } = await API.get("/orders");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleApiError(error, "Error fetching orders");
    return [];
  }
};

// Fetch all orders (Admin)
export const fetchAllOrders = async () => {
  try {
    const { data } = await API.get("/orders/all");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleApiError(error, "Error fetching all orders (Admin)");
    return [];
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (orderId, status) => {
  try {
    await API.put(`/orders/${orderId}`, { status });
    return true;
  } catch (error) {
    handleApiError(error, `Error updating order (ID: ${orderId}) status`);
    return false;
  }
};

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const { data } = await API.post("/cart", { productId, quantity });
    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
  }
};

// Fetch cart items
export const fetchCart = async () => {
  try {
    const { data } = await API.get("/cart");
    return data && Array.isArray(data.items) ? data : { items: [] };
  } catch (error) {
    handleApiError(error, "Error fetching cart");
    return { items: [] };
  }
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  try {
    await API.delete(`/cart/${productId}`);
    return true;
  } catch (error) {
    handleApiError(error, `Error removing product (ID: ${productId}) from cart`);
    return false;
  }
};

// Update an existing product (Admin)
export const updateProduct = async (productId, productData) => {
  try {
    const { data } = await API.put(`/products/${productId}`, productData);
    return data;
  } catch (error) {
    handleApiError(error, `Error updating product (ID: ${productId})`);
    return null;
  }
};

// Add a new product (Admin)
export const addProduct = async (product) => {
  try {
    const { data } = await API.post("/products", product);
    return data;
  } catch (error) {
    handleApiError(error, "Error adding product");
    return null;
  }
};

// Delete a product (Admin)
export const deleteProduct = async (productId) => {
  try {
    await API.delete(`/products/${productId}`);
    return true;
  } catch (error) {
    handleApiError(error, `Error deleting product (ID: ${productId})`);
    return false;
  }
};

// Start Checkout & Pass userId
export const startCheckout = async (items, userId) => {
  try {
    if (!userId) throw new Error("User ID is missing when starting checkout.");

    const { data } = await API.post("/checkout", { items, userId });
    return data.url; // Stripe Payment URL
  } catch (error) {
    handleApiError(error, "Error starting checkout");
    return null;
  }
};

// Confirm Payment After Redirect
export const confirmPayment = async (sessionId) => {
  try {
    const { data } = await API.post("/checkout/confirm-payment", { sessionId });    
    return data;
  } catch (error) {
    handleApiError(error, "Error confirming payment");
    return null;
  }
};

// Fetch Order by Session ID (for Success Page)
export const fetchOrderBySession = async (sessionId) => {
  try {
    const { data } = await API.get(`/orders/session/${sessionId}`);
    return data;
  } catch (error) {
    handleApiError(error, "Error fetching order by session ID");
    return null;
  }
};

export const fetchUserProfile = async () => {
  try {
    const { data } = await API.get("/user");
    return data;
  } catch (error) {
    handleApiError(error, "Error fetching user profile");
    return null;
  }
};

export const fetchUser = async (userId) => {
  try {
    const response = await API.get(`/user/${userId}`, {
      withCredentials: true, // Ensures authentication token is sent
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Ensure token is included
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error.response?.data || error.message);
    return null;
  }
};
