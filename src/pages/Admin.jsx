import { useEffect, useState } from "react";
import {
  fetchProducts,
  addProduct,
  fetchAllOrders,
  updateOrderStatus,
  updateProduct,
  fetchUser,
} from "../api/apiServices";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/"); // Redirect non-admin users
      return;
    }

    const loadAdminData = async () => {
      try {
        setLoading(true);
        const ordersData = await fetchAllOrders();
        const productsData = await fetchProducts();
        setOrders(ordersData);
        setProducts(productsData);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, [user, navigate]);

  useEffect(() => {
    if (orders.length > 0) {
      handleGetUsers(orders);
    }
  }, [orders]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );

      toast.success(`Order ${orderId} marked as ${status}`, {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status", { position: "top-right" });
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image before uploading.", {
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setUploading(true);
      const { data } = await API.post("/upload", formData);
      if (data?.imageUrl) {
        setNewProduct((prev) => ({ ...prev, image: data.imageUrl }));
        toast.success("Image uploaded successfully!", {
          position: "top-right",
        });
      } else {
        toast.error("Image upload failed. Try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed due to an error.", {
        position: "top-right",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();

    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.description ||
      !newProduct.category ||
      !newProduct.image ||
      newProduct.stock === ""
    ) {
      setError("All fields including stock are required.");
      toast.error("Please fill all required fields.", {
        position: "top-right",
      });
      return;
    }

    try {
      let updatedProduct;
      if (editMode) {
        updatedProduct = await updateProduct(editProductId, newProduct);
        setProducts(
          products.map((prod) =>
            prod._id === editProductId ? updatedProduct : prod
          )
        );
        toast.success("Product updated successfully!", {
          position: "top-right",
        });
      } else {
        updatedProduct = await addProduct(newProduct);
        setProducts([...products, updatedProduct]);
        toast.success("Product added successfully!", { position: "top-right" });
      }

      setNewProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        image: "",
        stock: "",
      });
      setEditMode(false);
      setEditProductId(null);
      setError("");
    } catch (error) {
      setError("Failed to add/update product.");
      toast.error("Failed to add/update product. Try again.", {
        position: "top-right",
      });
    }
  };

  // const handleEditProduct = (product) => {
  //   setNewProduct(product);
  //   setEditProductId(product._id);
  //   setEditMode(true);
  // };

  // const handleDeleteProduct = async (productId) => {
  //   if (!window.confirm("Are you sure you want to delete this product?"))
  //     return;

  //   try {
  //     await deleteProduct(productId);
  //     setProducts((prev) =>
  //       prev.filter((product) => product._id !== productId)
  //     );
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //   }
  // };

const handleGetUsers = async (orders) => {
    const uniqueUserIds = [...new Set(orders.map((order) => order.userId))]; // Extract unique user IDs
    const userMap = {};

    try {
      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          const user = await fetchUser(userId);
          if (user) {
            userMap[userId] = user;
          }
        })
      );
      setUserData(userMap);
    } catch (err) {
      toast.error("Failed to fetch user data:", err, { position: "top-right"});
    }
  };

  if (!user?.isAdmin) {
    return <p className="text-center text-[#9ca3af] text-lg">Redirecting...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
      <div className="w-full max-w-6xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33]">
        <h2 className="text-4xl font-bold text-center mb-8">Admin Panel</h2>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-center text-[#9ca3af]">Loading...</p>}

        {!loading && (
          <>
            {/* Orders Management */}
            <h3 className="text-2xl font-semibold text-[#e5e7eb] mb-4">
              Manage Orders
            </h3>
            {orders.length === 0 ? (
              <p className="text-[#9ca3af]">No orders found.</p>
            ) : (
              <div>
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-[#242729] p-6 rounded-lg shadow-md border border-[#2c2f33] mb-4"
                  >
                    {/* Order ID and Status */}
                    <h4 className="text-lg font-semibold text-white">
                      Order ID: {order._id}
                    </h4>
                    <p
                      className={`font-semibold ${
                        order.status === "Paid"
                          ? "text-yellow-400"
                          : order.status === "Cancelled"
                          ? "text-red-500"
                          : order.status === "Shipped"
                          ? "text-blue-400"
                          : "text-green-500"
                      }`}
                    >
                      Status: {order.status}
                    </p>
                    <p className="text-[#9ca3af] text-sm">
                      User email: {userData[order.userId]?.email || "Fetching..."}
                    </p>
                    <p className="text-[#9ca3af] text-sm">
                      Session ID: {order.sessionId}
                    </p>

                    {/* Order Items */}
                    <h5 className="text-lg font-semibold text-white mt-4">
                      Products Ordered:
                    </h5>
                    {order.items.map((item) => (
                      <div
                        key={item.productId._id}
                        className="flex items-center border-b border-[#2c2f33] py-4"
                      >
                        <img
                          src={item.productId.image}
                          alt={item.productId.name}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <p className="text-white font-semibold">
                            {item.productId.name}
                          </p>
                          <p className="text-[#9ca3af] text-sm">
                            {item.productId.description}
                          </p>
                          <p className="text-yellow-400 text-sm">
                            Category: {item.productId.category}
                          </p>
                          <p className="text-[#f97316] font-semibold">
                            ${item.productId.price} x {item.quantity} = $
                            {item.productId.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Total Amount */}
                    <p className="text-xl font-semibold text-green-400 mt-4">
                      Total Amount: ${order.totalAmount}
                    </p>

                    {/* Action Buttons for Order Status */}
                    <div className="mt-4">
                      <button
                        onClick={() => handleUpdateStatus(order._id, "Shipped")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Mark as Shipped
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(order._id, "Delivered")
                        }
                        className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      >
                        Mark as Delivered
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(order._id, "Cancelled")
                        }
                        className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add/Edit Product Section */}
            <h3 className="text-2xl font-semibold text-[#e5e7eb] mt-8">
              {editMode ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleAddOrUpdateProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, price: e.target.value }))
                }
                required
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                required
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, stock: e.target.value }))
                }
                required
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* File Upload */}
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="text-white"
              />
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={uploading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>

              <button
                type="submit"
                className="w-full bg-[#f97316] text-white py-2 rounded-md hover:bg-[#ea580c] transition"
              >
                {editMode ? "Update Product" : "Add Product"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
